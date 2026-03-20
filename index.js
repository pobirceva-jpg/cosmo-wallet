const { Telegraf } = require('telegraf');
const { TonClient, WalletContractV4, internal } = require('@ton/ton');
const { mnemonicToPrivateKey } = require('@ton/crypto');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Пример: проверка баланса игрового кошелька
bot.command('balance', async (ctx) => {
  try {
    const mnemonic = process.env.MNEMONIC.split(','); // 12 слов через запятую
    const keyPair = await mnemonicToPrivateKey(mnemonic);
    const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
    const balance = await client.getBalance(wallet.address);
    ctx.reply(`Баланс игрового кошелька: ${Number(balance) / 1e9} TON`);
  } catch (err) {
    ctx.reply('Ошибка: ' + err.message);
  }
});

// Запуск бота
bot.launch().then(() => {
  console.log('Бот запущен');
});

// Graceful shutdown (важно для Railway)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));