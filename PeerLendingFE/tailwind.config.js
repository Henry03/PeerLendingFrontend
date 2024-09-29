/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './Pages/**/*.cshtml',
        './Views/**/*.cshtml'
    ],
    plugins: [
        require('daisyui')
    ],
    daisyui: {
        themes: ["light", "dark"],
        base: true,

    },
}