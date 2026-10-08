# -*- coding: utf-8 -*-

import json
import os
import time
import requests
from datetime import datetime
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def load_env_file(path):
    """
    Reads KEY=VALUE lines from a .env file into os.environ.
    Values already set in the environment win.
    """

    if not os.path.exists(path):
        return

    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()

            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            os.environ.setdefault(
                key.strip(),
                value.strip().strip('"').strip("'")
            )


# Personal values live in .env (never committed); see .env.example.
load_env_file(os.path.join(BASE_DIR, ".env"))

SEPE_URL = (
    "https://citaprevia-sede.sepe.gob.es/"
    "citapreviasepe/?origen=sepe&codidioma=es"
)

POSTAL_CODE = os.environ.get("SEPE_POSTAL_CODE", "")

NIE = os.environ.get("SEPE_NIE", "")

TRAMITE = (
    "He finalizado un trabajo: acceso o reanudación "
    "de prestación o subsidio"
)

SUBTRAMITE = (
    "Alta inicial de prestación contributiva, "
    "que no necesiten aportar documentación adicional"
)

# Telefónica
CANAL_VALUE = "3"

# Check every 20 seconds
CHECK_INTERVAL = 20

# After this many failed checks in a row, restart the browser
MAX_CONSECUTIVE_FAILURES = 3

# Download a "Justificante" PDF (proof of the attempt)
# every 5 minutes while no appointments are available
JUSTIFICANTE_INTERVAL = 300

# Telegram
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")

# Log: one JSON object per line, next to this script
LOG_FILE = os.path.join(BASE_DIR, "sepe_log.jsonl")
SCREENSHOT_DIR = os.path.join(BASE_DIR, "screenshots")
JUSTIFICANTE_DIR = os.path.join(BASE_DIR, "justificantes")


# ============================================================
# JSON LOG
# ============================================================

def log_event(event, **fields):
    """
    Appends one event to LOG_FILE as a single JSON line.

    Never raises: logging must not take the bot down.
    """

    entry = {
        "time": datetime.now().isoformat(timespec="seconds"),
        "event": event,
        **fields,
    }

    try:
        line = json.dumps(
            entry,
            ensure_ascii=False,
            default=str
        )

        # Request errors include the Telegram URL,
        # which contains the bot token.
        if TELEGRAM_BOT_TOKEN:
            line = line.replace(TELEGRAM_BOT_TOKEN, "<TOKEN>")

        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")

    except Exception as e:
        print("Log write failed:", repr(e))


# ============================================================
# TELEGRAM
# ============================================================

def send_telegram(message):
    """
    Sends a Telegram message.

    Telegram has a message-length limit, so long messages
    are split into chunks.
    """

    if (
        not TELEGRAM_BOT_TOKEN
        or TELEGRAM_BOT_TOKEN == "YOUR_BOT_TOKEN_HERE"
        or not TELEGRAM_CHAT_ID
        or TELEGRAM_CHAT_ID == "YOUR_CHAT_ID_HERE"
    ):
        print("Telegram is not configured.")
        return

    url = (
        f"https://api.telegram.org/bot"
        f"{TELEGRAM_BOT_TOKEN}/sendMessage"
    )

    # Telegram max message is around 4096 characters.
    chunk_size = 4000

    chunks = [
        message[i:i + chunk_size]
        for i in range(0, len(message), chunk_size)
    ]

    for chunk in chunks:
        try:
            response = requests.post(
                url,
                data={
                    "chat_id": TELEGRAM_CHAT_ID,
                    "text": chunk,
                },
                timeout=15,
            )

            if not response.ok:
                print(
                    "Telegram error:",
                    response.status_code,
                    response.text
                )

                log_event(
                    "telegram_error",
                    status_code=response.status_code,
                    response=response.text
                )

            else:
                log_event(
                    "telegram_sent",
                    text=chunk
                )

        except Exception as e:
            print("Telegram exception:", e)

            log_event(
                "telegram_error",
                error=repr(e)
            )


def send_telegram_screenshot(page, caption):
    """
    Takes a screenshot of the current page and sends it
    to Telegram.

    Never raises: if the page is dead, the screenshot is
    simply skipped and a note is sent instead.
    """

    try:
        image = page.screenshot(
            full_page=True,
            timeout=15000
        )

    except Exception as e:
        print("Screenshot failed:", repr(e))

        log_event(
            "screenshot_failed",
            caption=caption,
            error=repr(e)
        )

        send_telegram(
            f"{caption}\n\n"
            "(Screenshot not possible: "
            f"{repr(e)[:300]})"
        )
        return

    # Keep a local copy so the log can point to it.
    screenshot_path = None

    try:
        os.makedirs(SCREENSHOT_DIR, exist_ok=True)

        screenshot_path = os.path.join(
            SCREENSHOT_DIR,
            datetime.now().strftime("%Y%m%d_%H%M%S_%f") + ".png"
        )

        with open(screenshot_path, "wb") as f:
            f.write(image)

    except Exception as e:
        print("Saving screenshot failed:", repr(e))
        screenshot_path = None

    log_event(
        "screenshot_taken",
        caption=caption,
        path=screenshot_path
    )

    url = (
        f"https://api.telegram.org/bot"
        f"{TELEGRAM_BOT_TOKEN}/sendPhoto"
    )

    try:
        response = requests.post(
            url,
            data={
                "chat_id": TELEGRAM_CHAT_ID,
                # Telegram captions are limited to 1024 chars.
                "caption": caption[:1024],
            },
            files={
                "photo": ("screenshot.png", image, "image/png"),
            },
            timeout=30,
        )

        if not response.ok:
            # Very tall full-page shots can be rejected
            # as photos; fall back to sending as a file.
            response = requests.post(
                url.replace("sendPhoto", "sendDocument"),
                data={
                    "chat_id": TELEGRAM_CHAT_ID,
                    "caption": caption[:1024],
                },
                files={
                    "document": ("screenshot.png", image, "image/png"),
                },
                timeout=30,
            )

        if not response.ok:
            print(
                "Telegram screenshot error:",
                response.status_code,
                response.text
            )

            log_event(
                "telegram_error",
                status_code=response.status_code,
                response=response.text,
                screenshot=screenshot_path
            )

        else:
            log_event(
                "telegram_screenshot_sent",
                screenshot=screenshot_path
            )

    except Exception as e:
        print("Telegram screenshot exception:", e)

        log_event(
            "telegram_error",
            error=repr(e),
            screenshot=screenshot_path
        )


# ============================================================
# PAGE TEXT
# ============================================================

def get_page_text(page):
    try:
        return page.locator("body").inner_text(timeout=10000)
    except Exception:
        return ""


# ============================================================
# STATUS DETECTION
# ============================================================

def detect_status(page):
    """
    Returns:

        unavailable
        available
        unknown
    """

    text = get_page_text(page)

    if not text:
        return "unknown"

    unavailable_phrase = (
        "En estos momentos no podemos ofrecerle citas"
    )

    if unavailable_phrase in text:
        return "unavailable"

    # If the usual unavailable message has disappeared,
    # something may have become available.
    #
    # We deliberately treat this as "available" rather than
    # claiming that a bookable slot definitely exists.
    possible_indicators = [
        "Día y hora de la cita",
        "Seleccione día",
        "Seleccione hora",
        "Horas disponibles",
        "Fecha",
        "Hora",
    ]

    for indicator in possible_indicators:
        if indicator.lower() in text.lower():
            return "available"

    # If the page no longer contains the unavailable message,
    # but we cannot identify a specific appointment element,
    # still flag it for manual inspection.
    if unavailable_phrase not in text:
        return "available"

    return "unknown"


# ============================================================
# POSTAL CODE
# ============================================================

def select_postal_code(page):

    print("Selecting postal code...")

    postal = page.locator(
        '[aria-labelledby="select2-datosCodigoPostal-container"]'
    )

    postal.wait_for(
        state="visible",
        timeout=15000
    )

    postal.click()

    page.wait_for_timeout(500)

    # SEPE uses a Select2 autocomplete.
    # The search field accepts characters progressively.
    for char in POSTAL_CODE:

        search = page.locator(
            ".select2-container--open .select2-search__field"
        )

        if search.count() == 0:
            break

        search.first.type(char)

        page.wait_for_timeout(700)

        # When the full postal code is recognised,
        # SEPE closes/replaces the search field automatically.
        if page.locator(
            ".select2-container--open .select2-search__field"
        ).count() == 0:
            break

    page.wait_for_timeout(1000)

    print("Postal code selected.")


# ============================================================
# TRAMITE
# ============================================================

def select_tramite(page):

    print("Selecting trámite...")

    option = page.locator(
        "select:visible option"
    ).filter(
        has_text=TRAMITE
    )

    if option.count() == 0:
        raise Exception(
            "Could not find trámite option."
        )

    tramite_select = option.first.locator(
        "xpath=.."
    )

    tramite_select.click()

    page.wait_for_timeout(500)

    tramite_select.select_option(
        label=TRAMITE
    )

    tramite_select.dispatch_event(
        "change"
    )

    page.wait_for_timeout(1500)

    print("Trámite selected.")


# ============================================================
# SUBTRAMITE
# ============================================================

def select_subtramite(page):

    print("Selecting subtrámite...")

    subtramite = page.locator(
        "#comboTiposServicios"
    )

    subtramite.wait_for(
        state="visible",
        timeout=10000
    )

    subtramite.click()

    page.wait_for_timeout(500)

    subtramite.select_option(
        label=SUBTRAMITE
    )

    subtramite.dispatch_event(
        "change"
    )

    page.wait_for_timeout(2000)

    print("Subtrámite selected.")


# ============================================================
# NIE
# ============================================================

def enter_nie(page):

    print("Entering NIE...")

    nie = page.locator(
        "#inputDNI"
    )

    nie.wait_for(
        state="visible",
        timeout=10000
    )

    nie.fill(NIE)

    page.wait_for_timeout(500)

    print("NIE entered.")


# ============================================================
# CONTINUAR
# ============================================================

def click_continuar(page):

    print("Clicking Continuar...")

    continuar = page.locator(
        'input[value="Continuar"]'
    )

    if continuar.count() == 0:
        continuar = page.get_by_role(
            "button",
            name="Continuar"
        )

    canal = page.locator("#comboCanales")

    # SEPE sometimes shows a CAPTCHA here instead of
    # the channel page.
    captcha = page.locator(
        "#recaptcha_response_field_datosPrevioMapa"
    )

    # SEPE is sometimes slow to load the next page, and
    # occasionally ignores the first click. Wait for the
    # channel page, and click once more if it never comes.
    for click_number in (1, 2):

        if click_number == 1 or continuar.first.is_visible():
            continuar.first.click()

        for _ in range(30):

            page.wait_for_timeout(1000)

            if canal.count() > 0 and canal.first.is_visible():
                print("Continuar clicked.")
                return

            if captcha.count() > 0 and captcha.first.is_visible():
                log_event("captcha_shown")
                raise Exception(
                    "SEPE is asking for a CAPTCHA after "
                    "Continuar. The bot cannot get past it."
                )

        log_event(
            "continuar_no_response",
            click=click_number
        )

        print("No response to Continuar, retrying...")

    raise Exception(
        "Channel page did not load after clicking "
        "Continuar twice (30 s each)."
    )


# ============================================================
# SELECT TELEPHONE
# ============================================================

def select_telephone(page):

    print("Selecting Telefónica...")

    canal = page.locator(
        "#comboCanales"
    )

    canal.wait_for(
        state="visible",
        timeout=15000
    )

    canal.select_option(
        value=CANAL_VALUE
    )

    canal.dispatch_event(
        "change"
    )

    page.wait_for_timeout(5000)

    print("Telefónica selected.")


# ============================================================
# COMPLETE FORM
# ============================================================

def complete_form(page):

    print()
    print("=" * 60)
    print("STARTING SEPE FORM")
    print("=" * 60)

    log_event("form_started")

    def open_page(page):
        page.goto(
            SEPE_URL,
            wait_until="domcontentloaded",
            timeout=30000
        )

        page.wait_for_timeout(2000)

    steps = [
        ("open_page", open_page),
        ("postal_code", select_postal_code),
        ("tramite", select_tramite),
        ("subtramite", select_subtramite),
        ("nie", enter_nie),
        ("continuar", click_continuar),
        ("telephone", select_telephone),
    ]

    for step_name, step in steps:
        try:
            step(page)

        except Exception as e:
            log_event(
                "form_step_failed",
                step=step_name,
                error=repr(e)
            )
            raise

    status = detect_status(page)

    log_event(
        "form_completed",
        status=status
    )

    print()
    print("Initial status:", status)
    print("=" * 60)

    return status


# ============================================================
# REFRESH / CHECK
# ============================================================

def refresh_and_check(page):
    """
    Returns (status, error).

    error is None unless the check raised an exception.
    """

    print(
        datetime.now().strftime("%H:%M:%S"),
        "- refreshing..."
    )

    try:

        page.reload(
            wait_until="domcontentloaded",
            timeout=30000
        )

        page.wait_for_timeout(2500)

        # If the channel selector is still present,
        # simply select Telefónica again.
        canal = page.locator(
            "#comboCanales"
        )

        if canal.count() > 0:

            canal.wait_for(
                state="visible",
                timeout=10000
            )

            canal.select_option(
                value=CANAL_VALUE
            )

            canal.dispatch_event(
                "change"
            )

            page.wait_for_timeout(4000)

            return detect_status(page), None

        # If the form state disappeared completely,
        # rebuild the whole form.
        print(
            "Form state lost. Rebuilding..."
        )

        log_event("form_state_lost")

        return complete_form(page), None

    except Exception as e:

        print(
            "Refresh/check error:",
            repr(e)
        )

        return "unknown", repr(e)


# ============================================================
# BROWSER
# ============================================================

def start_browser(p):

    browser = p.chromium.launch(
        headless=False
    )

    context = browser.new_context(
        accept_downloads=True
    )

    page = context.new_page()

    return browser, page


def restart_browser(p, browser):
    """
    Closes the (possibly dead) browser, opens a fresh one
    and rebuilds the form.

    Returns (browser, page, status, error).

    error is None if the form was rebuilt successfully.
    """

    print("Restarting browser...")

    log_event("browser_restart")

    try:
        browser.close()
    except Exception:
        # Browser may already be closed or crashed.
        pass

    browser, page = start_browser(p)

    try:
        status = complete_form(page)

        log_event(
            "browser_restart_done",
            status=status
        )

        return browser, page, status, None

    except Exception as e:

        print(
            "Form rebuild after restart failed:",
            repr(e)
        )

        log_event(
            "browser_restart_failed",
            error=repr(e)
        )

        return browser, page, "unknown", repr(e)


# ============================================================
# AVAILABILITY ALERT
# ============================================================

def send_availability_alert(
    attempts,
    status,
    page
):

    now = datetime.now()

    page_text = get_page_text(page)

    message = (
        "🚨 SEPE APPOINTMENT ALERT\n"
        "\n"
        "An appointment may now be available!\n"
        "\n"
        f"Time: {now.strftime('%d/%m/%Y %H:%M:%S')}\n"
        f"Check number: {attempts}\n"
        "\n"
        "Result:\n"
        "✅ The normal 'no appointments' "
        "message has disappeared.\n"
        "\n"
        "Please check the SEPE browser immediately."
        "\n\n"
        "Current page:\n"
        f"{page_text}"
    )

    log_event(
        "availability_alert",
        attempts=attempts,
        page_text=page_text
    )

    send_telegram(message)

    send_telegram_screenshot(
        page,
        "🚨 Screenshot at time of alert"
    )

    # Audible local warning as well
    try:
        print("\a")
    except Exception:
        pass

    print()
    print("!" * 60)
    print("!!! APPOINTMENT MAY BE AVAILABLE !!!")
    print("!" * 60)
    print()


# ============================================================
# CHANNEL OPTIONS
# ============================================================

def get_channel_options(page):
    """
    Returns the options of the channel dropdown as a list of
    (value, text), skipping empty placeholders such as
    "--- Seleccionar ---".

    Returns None if the dropdown cannot be read.
    """

    try:
        options = page.locator("#comboCanales option")

        result = []

        for i in range(options.count()):

            option = options.nth(i)

            value = (option.get_attribute("value", timeout=5000) or "").strip()
            text = option.inner_text(timeout=5000).strip()

            if value:
                result.append((value, text))

        return result

    except Exception as e:
        print("Could not read channel options:", repr(e))
        return None


def send_channel_alert(options, page):

    option_list = "\n".join(
        f"• {text}" for _, text in options
    )

    message = (
        "🚨 SEPE NEW CHANNEL AVAILABLE\n"
        "\n"
        "The channel dropdown now has more than "
        "just Telefónica:\n"
        "\n"
        f"{option_list}\n"
        "\n"
        f"Time: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n"
        "\n"
        "Please check the SEPE browser immediately."
    )

    log_event(
        "channel_alert",
        options=[text for _, text in options]
    )

    send_telegram(message)

    send_telegram_screenshot(
        page,
        "🚨 Screenshot of the channel options"
    )

    try:
        print("\a")
    except Exception:
        pass

    print()
    print("!" * 60)
    print("!!! NEW CHANNEL OPTION:", option_list.replace("\n", " "))
    print("!" * 60)
    print()


# ============================================================
# HOLD FOR USER
# ============================================================

def hold_for_user(page, reason):
    """
    Stops all refreshing and leaves the browser exactly as it
    is, so the appointment can be booked by hand.

    Blocks until Enter is pressed in the bot's window.
    """

    log_event(
        "paused_for_user",
        reason=reason
    )

    send_telegram(
        "⏸ SEPE bot PAUSED\n"
        "\n"
        f"{reason}\n"
        "\n"
        "The bot has stopped refreshing. The browser window "
        "is left on the page so you can book it by hand.\n"
        "\n"
        "When you are done, press Enter in the bot's window "
        "to resume monitoring."
    )

    try:
        page.bring_to_front()
    except Exception:
        pass

    print()
    print("#" * 60)
    print("PAUSED:", reason)
    print("The browser is left as it is. Book the appointment there.")
    print("Press Enter here to resume monitoring (Ctrl+C to quit).")
    print("#" * 60)

    try:
        input()

    except EOFError:
        # No console to read from: stay paused for good
        # rather than refresh the page away.
        while True:
            time.sleep(3600)

    log_event("resumed_by_user")

    print("Resuming monitoring...")


# ============================================================
# JUSTIFICANTE
# ============================================================

def download_justificante(page):
    """
    On the channel page, clicks "Justificante" and then
    "Descargar", and saves the PDF in JUSTIFICANTE_DIR.

    Returns the saved path. Raises on failure.

    Leaves the page on the justificante screen; the next
    check rebuilds the form anyway.
    """

    print("Downloading justificante...")

    page.locator("#btnJustificanteMapa").click(
        timeout=10000
    )

    descargar = page.locator(
        '#contenedorJustificanteMapa input[value="Descargar"]'
    )

    if descargar.count() == 0:
        descargar = page.locator(
            "#contenedorJustificanteMapa"
        ).get_by_role(
            "button",
            name="Descargar"
        )

    descargar.first.wait_for(
        state="visible",
        timeout=15000
    )

    with page.expect_download(timeout=30000) as download_info:
        descargar.first.click()

    download = download_info.value

    os.makedirs(JUSTIFICANTE_DIR, exist_ok=True)

    path = os.path.join(
        JUSTIFICANTE_DIR,
        "justificante_"
        + datetime.now().strftime("%Y%m%d_%H%M%S")
        + ".pdf"
    )

    download.save_as(path)

    print("Justificante saved:", path)

    return path


# ============================================================
# ERROR ALERT
# ============================================================

def send_error_alert(error_message, page=None):

    message = (
        "⚠️ SEPE BOT ERROR\n"
        "\n"
        f"Time: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n"
        "\n"
        f"{error_message}"
    )

    log_event(
        "error_alert",
        message=error_message
    )

    send_telegram(message)

    if page is not None:
        send_telegram_screenshot(
            page,
            "⚠️ Screenshot at time of error"
        )


# ============================================================
# MAIN
# ============================================================

def main():

    missing = [
        name for name, value in (
            ("SEPE_NIE", NIE),
            ("SEPE_POSTAL_CODE", POSTAL_CODE),
        )
        if not value
    ]

    if missing:
        print(
            "Missing settings: " + ", ".join(missing) + ".\n"
            "Copy .env.example to .env and fill it in."
        )
        return

    print()
    print("=" * 60)
    print("SEPE APPOINTMENT MONITOR")
    print("=" * 60)
    print()
    print("Check interval:", CHECK_INTERVAL, "seconds")
    print("Postal code:", POSTAL_CODE)
    print("Channel: Telefónica")
    print()
    print(
        "Telegram:"
        " immediate appointment + Presencial alerts"
    )
    print()
    print("=" * 60)

    log_event(
        "bot_started",
        check_interval=CHECK_INTERVAL,
        postal_code=POSTAL_CODE,
        log_file=LOG_FILE
    )

    send_telegram(
        "🟢 SEPE bot started.\n\n"
        f"Checking every {CHECK_INTERVAL} seconds.\n"
        "You will be notified if an appointment "
        "or the Presencial channel becomes available."
    )

    with sync_playwright() as p:

        browser, page = start_browser(p)

        # ----------------------------------------------------
        # Initial form
        # ----------------------------------------------------

        try:

            current_status = complete_form(page)

        except Exception as e:

            print(
                "Initial form error:",
                repr(e)
            )

            send_error_alert(
                "Initial SEPE form failed:\n"
                + repr(e),
                page=page
            )

            current_status = "unknown"

        # ----------------------------------------------------
        # Counters
        # ----------------------------------------------------

        attempts = 1

        # Failed checks in a row. Used to detect a stuck bot.
        consecutive_failures = 0
        last_error = None

        # Used to prevent repeated availability alerts.
        availability_alert_sent = False

        # An appointment may already be showing at startup.
        if current_status == "available":

            send_availability_alert(
                attempts=attempts,
                status=current_status,
                page=page
            )

            availability_alert_sent = True

            hold_for_user(
                page,
                "An appointment may be available."
            )

        # Used to prevent repeated channel alerts.
        channel_alert_sent = False

        # When the last justificante was downloaded, and
        # whether a failure alert has already been sent.
        last_justificante = None
        justificante_alert_sent = False

        # ----------------------------------------------------
        # Main loop
        # ----------------------------------------------------

        while True:

            try:

                # ==================================================
                # CHECK
                # ==================================================

                check_started = datetime.now()

                # Set when an alert needs the user to take over.
                hold_reason = None

                status, error = refresh_and_check(page)

                attempts += 1

                last_check_time = (
                    datetime.now().strftime("%H:%M:%S")
                )

                log_event(
                    "check",
                    attempt=attempts,
                    status=status,
                    error=error,
                    duration_s=round(
                        (datetime.now() - check_started).total_seconds(),
                        1
                    )
                )

                # --------------------------------------------------
                # Successful check
                # --------------------------------------------------

                if status != "unknown":

                    print(
                        f"[{last_check_time}] "
                        f"Attempt #{attempts}: "
                        f"{status}"
                    )

                    if consecutive_failures >= MAX_CONSECUTIVE_FAILURES:
                        log_event(
                            "recovered",
                            failed_checks=consecutive_failures
                        )

                        send_telegram(
                            "✅ SEPE bot recovered after "
                            f"{consecutive_failures} failed checks."
                        )

                    consecutive_failures = 0

                else:

                    consecutive_failures += 1
                    last_error = error or "Page was empty."

                    print(
                        f"[{last_check_time}] "
                        f"Attempt #{attempts}: "
                        f"UNKNOWN"
                    )

                # ==================================================
                # STUCK DETECTION
                # ==================================================

                # Every MAX_CONSECUTIVE_FAILURES failures in a row,
                # throw the browser away and start over. Alert only
                # on the first restart, to avoid spamming Telegram
                # while SEPE is down.

                if (
                    consecutive_failures > 0
                    and consecutive_failures % MAX_CONSECUTIVE_FAILURES == 0
                ):

                    first_restart = (
                        consecutive_failures == MAX_CONSECUTIVE_FAILURES
                    )

                    if first_restart:
                        # Screenshot of the broken page,
                        # taken before it is thrown away.
                        send_error_alert(
                            f"{consecutive_failures} failed checks "
                            "in a row. Restarting browser.\n\n"
                            f"Last error:\n{last_error}",
                            page=page
                        )

                    browser, page, status, error = restart_browser(
                        p,
                        browser
                    )

                    if status == "unknown":

                        last_error = error or "Page was empty."

                        if first_restart:
                            send_error_alert(
                                "Browser restart did not fix it. "
                                "Will keep retrying every "
                                f"{MAX_CONSECUTIVE_FAILURES} failed checks."
                                f"\n\nError:\n{last_error}",
                                page=page
                            )

                # ==================================================
                # AVAILABILITY TRANSITION
                # ==================================================

                # IMPORTANT:
                #
                # unavailable -> available
                #
                # triggers an immediate Telegram alert.
                #
                # available -> available
                #
                # does NOT send another alert.
                #
                # available -> unavailable
                #
                # resets the alert flag, so a later
                # unavailable -> available transition can alert again.

                if (
                    status == "available"
                    and current_status != "available"
                    and not availability_alert_sent
                ):

                    send_availability_alert(
                        attempts=attempts,
                        status=status,
                        page=page
                    )

                    availability_alert_sent = True

                    hold_reason = "An appointment may be available."

                elif status == "unavailable":

                    availability_alert_sent = False

                # ==================================================
                # CHANNEL OPTIONS
                # ==================================================

                # Normally the only channel is Telefónica.
                # Alert once when any other channel (e.g.
                # Presencial) shows up; alert again only after
                # it has gone back to Telefónica alone.

                if status != "unknown":

                    options = get_channel_options(page)

                    if options is not None:

                        extra_channels = [
                            text for value, text in options
                            if value != CANAL_VALUE
                        ]

                        if extra_channels:

                            if not channel_alert_sent:

                                send_channel_alert(
                                    options,
                                    page
                                )

                                channel_alert_sent = True

                                hold_reason = (
                                    "New channel available: "
                                    + ", ".join(extra_channels)
                                )

                        elif channel_alert_sent:

                            log_event(
                                "channel_options_back_to_normal",
                                options=[text for _, text in options]
                            )

                            channel_alert_sent = False

                # ==================================================
                # JUSTIFICANTE
                # ==================================================

                # Only while no appointments are available: if
                # one is, the page must stay as it is so it can
                # be booked.

                if (
                    status == "unavailable"
                    and not channel_alert_sent
                    and (
                        last_justificante is None
                        or (datetime.now() - last_justificante).total_seconds()
                        >= JUSTIFICANTE_INTERVAL
                    )
                ):

                    try:

                        path = download_justificante(page)

                        last_justificante = datetime.now()
                        justificante_alert_sent = False

                        log_event(
                            "justificante_downloaded",
                            path=path
                        )

                    except Exception as e:

                        print(
                            "Justificante download failed:",
                            repr(e)
                        )

                        log_event(
                            "justificante_failed",
                            error=repr(e)
                        )

                        # Alert once per run of failures;
                        # retried on the next check.
                        if not justificante_alert_sent:

                            send_error_alert(
                                "Justificante download failed:\n"
                                + repr(e),
                                page=page
                            )

                            justificante_alert_sent = True

                if status != current_status:
                    log_event(
                        "status_changed",
                        old=current_status,
                        new=status
                    )

                # Update status.
                current_status = status

                # ==================================================
                # PAUSE ON ALERT
                # ==================================================

                # Refreshing would throw away the page with the
                # appointment, so stop until the user says so.

                if hold_reason:
                    hold_for_user(page, hold_reason)
                    continue

                # ==================================================
                # WAIT
                # ==================================================

                elapsed = (
                    datetime.now() - check_started
                ).total_seconds()

                sleep_time = max(
                    0,
                    CHECK_INTERVAL - elapsed
                )

                print(
                    f"Waiting {sleep_time:.1f} seconds..."
                )

                time.sleep(sleep_time)

            # ======================================================
            # BROWSER / PLAYWRIGHT ERROR
            # ======================================================

            except KeyboardInterrupt:

                print()
                print(
                    "Stopping SEPE bot..."
                )

                log_event("bot_stopped")

                send_telegram(
                    "🔴 SEPE bot stopped manually."
                )

                break

            except Exception as e:

                print()
                print(
                    "MAIN LOOP ERROR:",
                    repr(e)
                )

                log_event(
                    "main_loop_error",
                    error=repr(e)
                )

                send_error_alert(
                    "Main loop error:\n"
                    + repr(e),
                    page=page
                )

                # Try to recover with a fresh browser.
                try:

                    browser, page, current_status, error = restart_browser(
                        p,
                        browser
                    )

                    if current_status == "unknown":
                        raise Exception(error or "Page was empty.")

                    if current_status == "unavailable":
                        availability_alert_sent = False

                    elif current_status == "available":

                        if not availability_alert_sent:

                            send_availability_alert(
                                attempts=attempts,
                                status=current_status,
                                page=page
                            )

                            availability_alert_sent = True

                            hold_for_user(
                                page,
                                "An appointment may be available."
                            )

                            continue

                except Exception as recovery_error:

                    print(
                        "Recovery failed:",
                        repr(recovery_error)
                    )

                    send_error_alert(
                        "Recovery failed:\n"
                        + repr(recovery_error),
                        page=page
                    )

                time.sleep(CHECK_INTERVAL)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()