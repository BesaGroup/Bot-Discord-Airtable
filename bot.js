const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (DISCORD_CHANNEL_ID && message.channel.id !== DISCORD_CHANNEL_ID) return;

  try {
    await axios.post(WEBHOOK_URL, {
      content: message.content,
      author: {
        username: message.author.username,
        id: message.author.id
      },
      timestamp: message.createdAt,
      messageId: message.id,
      channelId: message.channel.id
    });
    console.log('✅ Message sent to n8n');
  } catch (err) {
    console.error('❌ Failed to send to n8n:', err.message);
  }
});

client.login(process.env.BOT_TOKEN);
