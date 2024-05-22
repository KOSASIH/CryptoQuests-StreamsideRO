import asyncio
import json

from flask import Flask, request

# Initialize the Flask app
app = Flask(__name__)

# Define a list to store the connected clients
clients = []

# Define a function to handle incoming WebSocket connections


@app.route("/ws")
def handle_websocket():
    # Upgrade the HTTP connection to a WebSocket connection
    ws = request.websocket

    # Add the client to the list of connected clients
    clients.append(ws)

    # Send a welcome message to the client
    ws.send(json.dumps({"type": "info", "message": "Welcome to the multiplayer mode!"}))

    # Handle incoming WebSocket messages from the client
    while True:
        message = ws.receive()

        # Parse the message as JSON
        data = json.loads(message)

        # Handle the message based on its type
        if data["type"] == "action":
            # Handle the player's action
            handle_action(data["action"], ws)

        # Send the updated game state to all connected clients
        for client in clients:
            if client != ws:
                client.send(json.dumps(game_state))

    # Remove the client from the list of connected clients
    clients.remove(ws)

    return "WebSocket connection closed"


# Define a function to handle player actions


def handle_action(action, ws):
    # Update the game state based on the player's action
    if action["type"] == "buy":
        # Calculate the cost of buying the specified quantity of the cryptocurrency
        cost = (
            action["quantity"]
            * game_state["cryptocurrencies"][action["cryptocurrency"]]["price"]
        )

        # Check if the player has enough balance to make the purchase
        if cost > game_state["player"]["balance"]:
            # Send an error message to the client
            ws.send(json.dumps({"type": "error", "message": "Insufficient balance"}))
            return

        # Deduct the cost from the player's balance
        game_state["player"]["balance"] -= cost

        # Add the purchased cryptocurrency to the player's portfolio
        game_state["cryptocurrencies"][action["cryptocurrency"]]["quantity"] += action[
            "quantity"
        ]

    elif action["type"] == "sell":
        # Check if the player has enough quantity of the cryptocurrency to sell
        if (
            action["quantity"]
            > game_state["cryptocurrencies"][action["cryptocurrency"]]["quantity"]
        ):
            # Send an error message to the client
            ws.send(json.dumps({"type": "error", "message": "Insufficient quantity"}))
            return

        # Calculate the revenue from selling the specified quantity of the cryptocurrency
        revenue = (
            action["quantity"]
            * game_state["cryptocurrencies"][action["cryptocurrency"]]["price"]
        )

        # Add the revenue to the player's balance
        game_state["player"]["balance"] += revenue

        # Deduct the sold cryptocurrency from the player's portfolio
        game_state["cryptocurrencies"][action["cryptocurrency"]]["quantity"] -= action[
            "quantity"
        ]


# Define a function to send messages to the client


def send_message(ws, message):
    # Convert the message to JSON
    message_json = json.dumps(message)

    # Send the message to the client over the WebSocket connection
    ws.send(message_json)


# Define a function to start the game loop


async def start_game_loop():
    # Run the game loop indefinitely
    while True:
        # Handle incoming WebSocket messages from the cryptocurrency API
        message = await websocket.recv()

        # Handle the message by updating the game state
        handle_message(message)

        # Send the updated game state to all connected clients
        for client in clients:
            client.send(json.dumps(game_state))

        # Wait for a moment before processing the next message
        await asyncio.sleep(1)


# Start the Flask server and the WebSocket game loop
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
    asyncio.get_event_loop().run_until_complete(start_game_loop())
