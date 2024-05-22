import json
import websockets

# Set up the WebSocket connection to the cryptocurrency API
websocket = websockets.connect("wss://stream.coinbase.com")

# Define the game state object
game_state = {
    "player": {"balance": 10000},  # starting balance in USD
    "cryptocurrencies": {
        "BTC": {"price": 0, "quantity": 0},
        "ETH": {"price": 0, "quantity": 0},
    },
}


# Define a function to handle incoming WebSocket messages
async def handle_message(message):
    # Parse the message as JSON
    data = json.loads(message)

    # Update the game state with the latest cryptocurrency prices
    for product in data["product_id"]:
        if product.startswith("BTC-USD"):
            game_state["cryptocurrencies"]["BTC"]["price"] = data["price"]
        elif product.startswith("ETH-USD"):
            game_state["cryptocurrencies"]["ETH"]["price"] = data["price"]


# Define a function to send the updated game state to the client


def send_game_state():
    # Convert the game state to JSON
    state_json = json.dumps(game_state)

    # Send the game state to the client over the WebSocket connection
    websocket.send(state_json)


# Define a function to handle player actions


def handle_action(action):
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
            send_message({"error": "Insufficient balance"})
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
            send_message({"error": "Insufficient quantity"})
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


def send_message(message):
    # Convert the message to JSON
    message_json = json.dumps(message)

    # Send the message to the client over the WebSocket connection
    websocket.send(message_json)


# Define a function to start the game loop


async def start_game_loop():
    # Run the game loop indefinitely
    while True:
        # Handle incoming WebSocket messages
        message = await websocket.recv()

        # Parse the message as JSON
        data = json.loads(message)

        # Handle the message based on its type
        if data["type"] == "action":
            # Handle the player's action
            handle_action(data["action"])

        # Handle incoming WebSocket messages from the cryptocurrency API
        message = await websocket.recv()

        # Handle the message by updating the game state
        await handle_message(message)

        # Send the updated game state to the client
        send_game_state()


# Start the game loop
asyncio.get_event_loop().run_until_complete(start_game_loop())
