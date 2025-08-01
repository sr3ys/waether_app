document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const weatherDataContainer = document.getElementById('weather-data');

    const apiKey = '9406fcdccec035d9cf44912d235aca02';

    const getWeatherByCity = async (cityName) => {
        loader.style.display = 'flex';
        weatherDataContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`City not found (${response.status})`);
            }
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            errorMessage.classList.remove('hidden');
        } finally {
            loader.style.display = 'none';
        }
    };

    const updateUI = (data) => {
        document.getElementById('city-name').textContent = data.name;
        document.getElementById('temperature').textContent = Math.round(data.main.temp);
        document.getElementById('weather-description').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        document.getElementById('visibility').textContent = `${data.visibility / 1000} km`;

        const currentDate = new Date(data.dt * 1000);
        document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const weatherIconContainer = document.getElementById('weather-icon');
        const iconName = getWeatherIcon(data.weather[0].icon);
        weatherIconContainer.innerHTML = `<i data-feather="${iconName}" class="w-20 h-20 md:w-24 md:h-24"></i>`;
        feather.replace();

        weatherDataContainer.classList.remove('hidden');
    };

    const getWeatherIcon = (iconCode) => {
        const iconMap = {
            '01d': 'sun', '01n': 'moon',
            '02d': 'cloud-sun', '02n': 'cloud-moon',
            '03d': 'cloud', '03n': 'cloud',
            '04d': 'cloud', '04n': 'cloud',
            '09d': 'cloud-drizzle', '09n': 'cloud-drizzle',
            '10d': 'cloud-rain', '10n': 'cloud-rain',
            '11d': 'cloud-lightning', '11n': 'cloud-lightning',
            '13d': 'cloud-snow', '13n': 'cloud-snow',
            '50d': 'wind', '50n': 'wind'
        };
        return iconMap[iconCode] || 'sun';
    };

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cityName = cityInput.value.trim();
        if (cityName) {
            getWeatherByCity(cityName);
        }
    });

    getWeatherByCity('varanasi');
    getWeatherByCity('allahabad');
});