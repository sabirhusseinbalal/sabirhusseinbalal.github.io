# CONTRIBUTING

This project is created by those who like to make and share games.

Thanks to all those who have contributed!

## What we accept

Every game must be:

- **Playable.** Does not require any extra items.
- **Original.** You've made it and it's not another person's game.
- **Understandable.** If your code is understandable, then it is understandable for another beginner.
- **Finished.** No half-done games.

## The rules 

1. Use only HTML, CSS and JavaScript.
2. While use of AI tools is allowed, you should know what you are submitting.
3. Avoid any frameworks and there are no libraries. Plain code only.
4. No images, audio, video, GIFs, SVG files or custom fonts. Make your visuals with CSS, HTML, text and Unicode characters (like ❤ or ★).
5. 1 game per folder, 1 game per pull request.
6. The game should be available for both mobile and desktop.
7. Explain your game. Add a brief "How to play" description to the game page, and include simple comments in your code.
8. Be able to describe what your code does when I ask. The review is a part of this.
9. Do not copy another contributor's game and do not use characters, names or code that is not original without permission.
10. No ads, no trackers, no malicious code, no network request (no fetch, no external links or scripts).
11. Keep it small. The size of a game folder should not exceed 500KB.

## Folder structure

Create a folder with your GitHub username, and then create one folder for each game:

```
games/
└── your-username/
    └── your-game-name/
        ├── index.html
        ├── style.css
        └── script.js
```

- Use the lowercase version of your username.
- Game folder names are all lowercase with only numbers, letters and hyphens. No spaces. Example: `number-guess`.
- There are exactly these three files, and they are always named as such in every game.
- No README, image or other file in a game folder.
- Games can be added as you like. Each is assigned its own folder and its own pull request.
- Don't change the website files (the main `index.html`, `style.css`, `app.js`, or anything in `data/`).

## Your index.html

Your game page should have:

- Your game name inside `<title>`. It is used as the name for the game on the website.
- This line in the `<head>`, so it works on phones:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- Only works with your files:

```html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
```

## Pull request

In a pull request discuss a few lines about:

- What your game is
- How to play it
- How your code is structured (e.g., the use of variables)

## Review

I will verify your game works, is played by the rules, and that you understand the game. If there is something to change I will let you know what and why. All is fine, this is normal. Reviews are how we all learn.

## License

When sending a game, you agree to the sharing of the game under this project's [MIT License](LICENSE).

## Questions?

Start a discussion and inquire. There is no such thing as a small question!