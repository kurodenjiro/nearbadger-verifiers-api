import badger from './nearbadger.js';


const TELEGRAM_AUTH_URL = 'https://oauth.telegram.org/auth';

export class TelegramAPI {
    app_id = 1417389;
    api_hash = '30039fb7264f36f01f8c0a9f40837646';

    static async getUserHandle(tgAuth) {
        return JSON.parse(atob(tgAuth)).username || ""
    }
    static async getUserAuthHandle(tgAuth) {
        return JSON.parse(atob(tgAuth)).username || ""
    }


}

export class TelegramAuth {
    generateAuthURL({bot_id,origin, redirectUri}) {
        return this.getBaseURL({
            bot_id: bot_id,
            origin:origin,
            state: `telegram.${handle}.${state}`,
            redirectUri
        });
    }

    generateChallenge(accountId, handle) {
        const platform = 'telegram';
        const nonce = badger.getSafeNonce();
        const rawChallenge = this.getRawChallenge({
            accountId,
            handle,
            platform,
            nonce
        });
        const signature = Buffer.from(
            badger.sign(rawChallenge)
        ).toString('base64');

        return Buffer.from(`${rawChallenge},${signature}`).toString("base64");
    }

    decodeChallenge(encodedChallenge) {
        const sanitizedEncodedChallenge = decodeURIComponent(encodedChallenge);
        const decodedChallenge = Buffer.from(sanitizedEncodedChallenge, "base64").toString('utf-8');
        const [accountId, handle, platform, nonce, encodedSignature] = decodedChallenge.split(',');

        return {
            challenge: this.getRawChallenge({
                accountId,
                handle,
                platform,
                nonce
            }),
            signature: encodedSignature
        };
    }

    getRawChallenge({ accountId, handle, platform, nonce }) {
        return `${accountId},${handle},${platform},${nonce}`;
    }

    getBaseURL({ bot_id,origin, redirectUri }) {
        const searchParams = new URLSearchParams({
            bot_id:bot_id,
            origin:origin,
            return_to: redirectUri
        });

        return `${TELEGRAM_AUTH_URL}?${searchParams.toString()}&embed=1&request_access=write`;
    }
}