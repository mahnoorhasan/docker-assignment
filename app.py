from flask import Flask, request, jsonify
import requests
import redis
import os

app = Flask(__name__)
cache = redis.Redis(host='localhost', port=6379)

API_KEY = os.getenv('OPENWEATHER_API_KEY')

@app.route('/weather')
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City not specified'}), 400

    cached = cache.get(city)
    if cached:
        return jsonify({'city': city, 'data': cached.decode(), 'cached': True})

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    data = response.json()

    cache.setex(city, 300, str(data))
    return jsonify({'city': city, 'data': data, 'cached': False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
