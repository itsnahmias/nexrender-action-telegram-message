/**
 * Nexrender Telegram Notification Action
 * 
 * Sends Telegram messages on prerender, postrender, and error events.
 * 
 * @param {Object} job - The Nexrender job object
 * @param {Object} settings - The Nexrender settings object
 * @param {string} type - The event type: 'prerender', 'postrender', or 'error'
 * @returns {Promise<void>}
 */
export default async function (job, settings, type) {
  // Allow both job.action fields and env fallbacks
  const a = job.action || {};
  const botToken = a.botToken || process.env.TG_TOKEN;
  const chatId = a.chatId || process.env.TG_CHAT_ID;
  let extra = a.text || '';
  
  // For error events, include the error message in the text
  if (type === 'error' && job.error && !extra) {
    extra = `Error: ${job.error}`;
  }

  if (!botToken || !chatId) {
    return Promise.reject(new Error('Telegram botToken or chatId missing'));
  }

  // Format the message using the message formatter
  const messageText = formatMessage(job, type, extra);

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: messageText,
    parse_mode: 'Markdown'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Telegram API ${response.status}: ${errorText}`);
    }

    return response;
  } catch (error) {
    // Log the error but don't fail the render job
    console.error(`[Telegram Action] Failed to send message:`, error.message);
    throw error;
  }
}

/**
 * Format the message for Telegram based on job details and event type
 * 
 * @param {Object} job - The Nexrender job object
 * @param {string} type - The event type: 'prerender', 'postrender', or 'error'
 * @param {string} extra - Additional custom text
 * @returns {string} Formatted message text
 */
function formatMessage(job, type, extra = '') {
  const headerMap = {
    prerender: '🚀 *Render Started*',
    postrender: '✅ *Render Finished*',
    error: '❌ *Render Failed*'
  };
  
  const header = headerMap[type] || 'ℹ️ *Render Update*';
  
  // Build job details section
  const jobDetails = [];
  
  if (job.uid) {
    jobDetails.push(`*Job ID:* \`${job.uid}\``);
  }
  
  if (job.template?.composition) {
    jobDetails.push(`*Composition:* \`${job.template.composition}\``);
  }
  
  if (job.template?.src) {
    // Extract filename from path for cleaner display
    const fileName = job.template.src.split('/').pop() || job.template.src;
    jobDetails.push(`*Project:* \`${fileName}\``);
  }
  
  if (job.output) {
    const outputFile = job.output.split('/').pop() || job.output;
    jobDetails.push(`*Output:* \`${outputFile}\``);
  }
  
  if (type === 'error' && job.error) {
    jobDetails.push(`*Error:* \`${job.error}\``);
  }
  
  // Build the complete message
  const messageParts = [
    header,
    '',
    '*Job Details:*',
    ...jobDetails.map(detail => `• ${detail}`)
  ];
  
  // Add custom text if provided
  if (extra) {
    messageParts.push('', extra);
  }
  
  return messageParts.join('\n');
} 