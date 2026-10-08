# SEPE appointment bot

Getting a SEPE cita previa has become a race against bots run by resellers, who grab slots the moment they appear and sell them back. This bot is the counter-move: it asks for **one appointment, for one person**, and never sells anything.

Every 20 seconds it fills in SEPE's cita previa form in a real browser. When an appointment (or a new channel such as Presencial) shows up, it sends a Telegram alert with a screenshot and **pauses**, leaving the page open so you can book it by hand.

## What it does

- Checks every 20 seconds, day and night.
- Telegram messages only when it matters: on start, on an appointment, on a new channel, or when it gets stuck.
- Pauses on a hit: no more refreshing until you press Enter in its window.
- Downloads SEPE's *justificante* (proof of the attempt) every 5 minutes while nothing is available.
- Recovers on its own: after 3 failed checks in a row it alerts you and restarts the browser.
- Logs every event to `sepe_log.jsonl`, with screenshots in `screenshots/`.

## Setup

```sh
pip install -r requirements.txt
python -m playwright install chromium
```

Copy `.env.example` to `.env` and fill in your NIE, postal code and Telegram details. `.env` is ignored by git.

To get the Telegram values: create a bot with [@BotFather](https://t.me/BotFather) for the token, send it a message, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` to find your chat ID.

The trámite and subtrámite are set near the top of `sepe_bot.py`; change them there if you need a different appointment type.

## Run

```sh
python sepe_bot.py
```

A browser window opens and the checks start. Ctrl+C stops the bot.

## Privacy

The log, screenshots and justificante PDFs contain your NIE. They are written next to the script and are excluded by `.gitignore`; do not share them.

## Interactive story

`interactive-sepe-bot/` is a small Svelte app telling the story of the project: why appointments are so hard to get, and how the bot found one. See its own README to run it.
