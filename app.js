// ---------- Red particles ----------
const snowContainer = document.querySelector('.snow');
const snowflakeCount = 60;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (snowContainer && !reduceMotion) {
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');

        // size: 4px to 10px
        const size = Math.random() * 6 + 4;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;

        // random place across the width, always starts above the screen
        snowflake.style.left = `${Math.random() * 100}%`;

        // negative delay = already falling when the page opens
        const duration = Math.random() * 10 + 8;
        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.animationDelay = `-${Math.random() * duration}s`;

        snowContainer.appendChild(snowflake);
    }
}


// ---------- Load games from data/games.json ----------
async function loadGames() {
    const gameList = document.getElementById('game-list');
    const contributorList = document.getElementById('contributor-list');

    try {
        const response = await fetch('data/games.json');
        if (!response.ok) throw new Error('Could not load games.json');
        const data = await response.json();

        document.getElementById('total-games').textContent = data.totalGames;
        document.getElementById('total-contributors').textContent = data.totalContributors;

        if (data.games.length > 0) {
            gameList.innerHTML = '';

            data.games.forEach(game => {
                const card = document.createElement('div');
                card.className = 'game';

                const info = document.createElement('div');
                const title = document.createElement('h3');
                title.textContent = game.name;
                const author = document.createElement('p');
                author.textContent = 'by ' + game.author;
                info.append(title, author);

                const link = document.createElement('a');
                link.className = 'play-link';
                link.href = game.url;
                link.target = '_blank';                  // opens in a new tab
                link.rel = 'noopener noreferrer';
                link.textContent = 'Play →';

                card.append(info, link);
                gameList.appendChild(card);
            });
        }

        if (data.contributors.length > 0) {
            contributorList.innerHTML = '';

            data.contributors.forEach(person => {
                const card = document.createElement('div');
                card.className = 'contributor';

                // profile picture from GitHub
                const avatar = document.createElement('img');
                avatar.src = 'https://github.com/' + encodeURIComponent(person.username) + '.png?size=112';
                avatar.alt = person.username + ' profile picture';
                avatar.width = 56;
                avatar.height = 56;
                avatar.loading = 'lazy';

                const info = document.createElement('div');

                const name = document.createElement('h3');
                name.textContent = person.username;

                const link = document.createElement('a');
                link.href = person.profile;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = 'View profile →';

                info.append(name, link);
                card.append(avatar, info);
                contributorList.appendChild(card);
            });
        }
    } catch (error) {
        console.error(error); // the "getting ready" messages stay on the page
    }
}

loadGames();
