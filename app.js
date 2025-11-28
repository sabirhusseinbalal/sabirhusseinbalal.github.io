const snowContainer = document.querySelector('.snow');
const snowflakeCount = 80; // number of snowflakes

for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');

    // Randomize size
    const size = Math.random() * 6 + 4; // 4px to 10px
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;

    // Random starting position (top-right side)
    snowflake.style.top = `${Math.random() * 100}vh`;
    snowflake.style.left = `${Math.random() * 100}vw`;

    // Random duration and delay
    const duration = Math.random() * 10 + 5; // 5s to 15s
    const delay = Math.random() * 10;
    snowflake.style.animationDuration = `${duration}s`;
    snowflake.style.animationDelay = `${delay}s`;

    snowContainer.appendChild(snowflake);
}