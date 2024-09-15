import http from 'http';
import WebSocket from 'ws';

const clients = new Map();
const callQueue: string[] = [];
const rules = new Map<string, Map<string, number>>();
const calls: string[] = []

function findCallPair(email: string) {
    const now = Date.now();

    for (const client of callQueue) {
        const rule = rules.get(client);
        if (client !== email && (!rule?.get(email) || (now - rule.get(email)! > 86400000))) {
            return client;
        }
    }
    return null;
}

function updateRules(email: string, client: string, now: number) {
    if (!rules.has(email)) {
        rules.set(email, new Map<string, number>());
    }
    if (!rules.has(client)) {
        rules.set(client, new Map<string, number>());
    }
    rules.get(email)!.set(client, now);
    rules.get(client)!.set(email, now);
}

function handleMakeCall(email: string, ws: WebSocket) {
    const pair = findCallPair(email);
    if (!pair) {
        callQueue.push(email);
        return true;
    }

    const newCallId = `${email}-${pair}`;

    clients.get(pair)?.send(
        JSON.stringify({
            newCallId: newCallId,
            to: email
        })
    );
    ws.send(
        JSON.stringify({
            newCallId: newCallId,
            to: pair
        })
    );

    callQueue.splice(callQueue.indexOf(pair), 1);

    const now = Date.now();
    updateRules(email, pair, now);
    calls.push(newCallId);
}

function handleOnMessage(message: WebSocket.RawData, ws: WebSocket) {
    const parsed = JSON.parse(message.toString());
    const email = parsed.email;

    switch (parsed.type) {
        case 'init':
            clients.set(email, ws);
            handleMakeCall(email, ws);
            break;

        case 'next':
            const callId = calls.find(call => call.includes(email));
            calls.splice(calls.indexOf(callId!), 1);

            const pair = callId?.split('-').find(call => call !== email);

            if (pair) {
                const inQueuePair = handleMakeCall(pair, clients.get(pair));
                if (inQueuePair) {
                    clients.get(pair).send(JSON.stringify({ type: 'next' }));
                }
            }

            const inQueueCurr = handleMakeCall(email, ws);
            if (inQueueCurr) {
                ws.send(JSON.stringify({ type: 'next' }));
            }

            break;
    }
}

function handleOnClose(ws: WebSocket) {
    for (const [email, socket] of clients) {
        if (socket === ws) {
            clients.delete(email);
            callQueue.splice(callQueue.indexOf(email), 1);

            const callId = calls.find(call => call.includes(email));
            const pair = callId?.split('-').find(call => call !== email);

            calls.splice(calls.indexOf(callId!), 1);
            if (pair) {
                const inQueuePair = handleMakeCall(pair, clients.get(pair));

                if (inQueuePair) {
                    const payload = JSON.stringify({ type: 'next' });
                    clients.get(pair)?.send(payload);
                }
            }
            break;
        }
    };
}

function initializeWebSocket(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        ws.on('message', (message) => handleOnMessage(message, ws));
        ws.on('close', () => handleOnClose(ws));
    });

    return wss;
}

export default initializeWebSocket;
