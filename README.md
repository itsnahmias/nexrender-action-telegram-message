# Nexrender Telegram Notification Action

A Nexrender action that sends Telegram notifications on `prerender`, `postrender`, and `error` events.

## Features

- ✅ Sends notifications for render start, completion, and errors
- ✅ Configurable via job actions or environment variables
- ✅ Markdown formatting support
- ✅ Custom message text support
- ✅ Node.js 18+ with native fetch support
- ✅ Zero dependencies

## Requirements

- **Node.js ≥ 18** (uses native `fetch`)
- Nexrender server/client
- Telegram bot token and chat ID

## Installation

### Option 1: Local Installation

```bash
# Clone or download this repository
git clone https://github.com/itsnahmias/nexrender-action-telegram-message.git
cd nexrender-action-telegram-message
```

### Option 2: Global Installation

```bash
npm install -g nexrender-action-telegram-message
```

### Option 3: Direct GitHub Installation

```bash
npm i -g https://github.com/itsnahmias/nexrender-action-telegram-message
```

## Telegram Setup

1. **Create a Telegram Bot:**

   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` and follow the instructions
   - Save the bot token (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

2. **Get Chat ID:**

   - Add your bot to the target chat/group
   - Send any message in the chat
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find the `chat.id` in the response (for groups, it starts with `-100`)

3. **Set Environment Variables:**
   ```bash
   export TG_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   export TG_CHAT_ID=-1001234567890
   ```

## Usage

### Configuration

Add the action to your Nexrender job. You can use environment variables (recommended) or specify parameters directly:

**Using environment variables (recommended):**

```json
{
  "template": {
    "src": "file:///path/project.aep",
    "composition": "main"
  },
  "actions": {
    "prerender": [
      {
        "module": "./nexrender-action-telegram-message",
        "text": "Spinning up render..."
      }
    ],
    "postrender": [
      {
        "module": "./nexrender-action-telegram-message",
        "text": "Render completed successfully!"
      }
    ],
    "error": [
      {
        "module": "./nexrender-action-telegram-message"
      }
    ]
  }
}
```

**Or specify parameters directly:**

```json
{
  "actions": {
    "prerender": [
      {
        "module": "./nexrender-action-telegram-message",
        "botToken": "${env.TG_TOKEN}",
        "chatId": "${env.TG_CHAT_ID}",
        "text": "Spinning up render..."
      }
    ]
  }
}
```

### Module Path Options

The `module` field can be:

- **Local path:** `"./nexrender-action-telegram-message"`
- **Global package:** `"nexrender-action-telegram-message"`
- **Absolute path:** `"/path/to/nexrender-action-telegram-message"`

## Message Format

The action sends beautifully formatted messages with job details:

- **Prerender:** 🚀 Render Started
- **Postrender:** ✅ Render Finished
- **Error:** ❌ Render Failed

Each message includes:

- Event type with emoji and bold header
- Job ID and composition name
- Project filename (clean display)
- Output filename (for postrender)
- Error details (for error events)
- Custom text (if provided)

### Example Messages

**Prerender:**

```
🚀 *Render Started*

*Job Details:*
• *Job ID:* `job-12345`
• *Composition:* `main`
• *Project:* `project.aep`

🚀 Starting render job...
```

**Postrender:**

```
✅ *Render Finished*

*Job Details:*
• *Job ID:* `job-12345`
• *Composition:* `main`
• *Project:* `project.aep`
• *Output:* `video.mp4`

✅ Render completed successfully!
```

**Error:**

```
❌ *Render Failed*

*Job Details:*
• *Job ID:* `job-12345`
• *Composition:* `main`
• *Project:* `project.aep`
• *Error:* `After Effects crashed unexpectedly`

🚨 Render failed - check logs immediately
```

## Configuration Options

| Field      | Type   | Required | Description            |
| ---------- | ------ | -------- | ---------------------- |
| `botToken` | string | Yes\*    | Telegram bot token     |
| `chatId`   | string | Yes\*    | Telegram chat/group ID |
| `text`     | string | No       | Custom message text    |

\*Required if not set via environment variables

## Error Handling

- Missing `botToken` or `chatId` throws a clear error
- Telegram API errors are logged but don't fail the render job
- Network errors are handled gracefully

## Troubleshooting

### Common Issues

1. **"Telegram botToken or chatId missing"**

   - Check environment variables are set correctly
   - Verify bot token format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   - Ensure chat ID is correct (groups start with `-100`)

2. **"Telegram API 403: Forbidden"**

   - Bot not added to the chat/group
   - Bot doesn't have permission to send messages

3. **"Telegram API 400: Bad Request"**
   - Invalid chat ID format
   - Bot token is incorrect

## License

MIT License - see LICENSE file for details.

### Enjoy
