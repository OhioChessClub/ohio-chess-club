const sendCss = async (req, res) => {
    var css = `
    <style>
    .view-title-inside {
        text-align: left;
        position: absolute;
        bottom: 0;
        left: 0;
        margin: 0;
        padding-left: 15px;
        padding-bottom: 10px;
        width: 125px;
    }

    .view-desc-inside {
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 0;
        padding-right: 15px;
        padding-bottom: 10px;
    }

    .view-content .view {
        font-size: 15px;
    }

    .view {
        display: inline-block;
        padding: 20px;
        padding-top: 0;
        border-width: 3px;
        border-radius: 20px;
        border-style: solid;
        width: 250px;
        position: relative;
        height: 300px;
    }

    .view-desc {
        font-size: 16px;
    }

    .viewtext h1 {
        font-size: 24px;
    }

    .feature-icondiv {
        display: inline-block;
        padding: 10px 20px;
        border-radius: 5px;
        background-color: #4f46e5;
        color: white;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.5s ease;
    }

    .feature-icondiv:hover {
        background-color: #8046e5;
    }

    .featcontainer {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
    }

    a {
        color: unset;
        text-decoration: none;
    }

    nav {
        animation: zoomintop 1s;
    }

    body {
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
    }

    .bg-white {
        background-color: white;
    }

    .logo-icon {
        vertical-align: text-bottom;
        margin-right: 12px;
    }

    .text-center {
        margin-top: 25vh;
    }

    .button-purple-color {
        background: #4f46e5;
        color: white;
        border: none;
        font-weight: 600;
        font-size: 39;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .button-texture {
        padding: 10px 14px;
        border-radius: .375rem;
    }

    .buttonpurple-hover-effect {
        background-color: #4f46e5;
        transition: background-color 0.5s ease;
        color: white;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
    }

    .buttonpurple-hover-effect:hover {
        background-color: #8046e5;
    }

    .nav-top-white li {
        list-style: none;
        display: inline-block;
        padding: 5px 14px;
        border-radius: .375rem;
        margin-top: 15px;
        font-weight: 600;
        font-size: .875rem;
        line-height: 1.5rem;
        cursor: pointer;
    }

    #navlogotext {
        color: black;
        opacity: 1;
        text-align: left;
        cursor: text;
    }

    .nav-text-color-gray {
        color: grey;
    }

    .nav-top-white {
        text-align: center;
        padding: 0;
        margin: 0;
    }

    @font-face {
        font-family: 'title';
        src: url('fonts/google-concertone.ttf') format('truetype');
    }

    @font-face {
        font-family: 'description';
        src: url('fonts/google-robotomono.ttf') format('truetype');
    }

    @font-face {
        font-family: 'subtitle';
        src: url('fonts/google-francoisone.ttf') format('truetype');
    }

    @font-face {
        font-family: 'subtext';
        src: url('fonts/google-leaguespartan.ttf') format('truetype');
    }

    .title {
        font-family: title, arial;
        font-size: 60px;
        font-weight: 100;
        animation: zoomintitle 1s;
    }

    .title-desc {
        font-family: description, arial;
        font-size: 20px;
    }

    .subdiv {
        width: 100%;
        padding-top: 10%;
    }

    .subtitle {
        font-family: subtitle, arial;
        font-size: 28px;
        font-weight: 100;
    }

    .subtext {
        font-family: subtext, arial;
        font-size: 20px;
        font-weight: 400;
        padding: 32px;
        line-height: 35px;
        padding-top: 5px;
        padding-bottom: 0px;
        padding-left: 60px;
        padding-right: 60px;
    }

    .icon {
        font-size: 2em;
        padding: 8px 8px;
        vertical-align: middle;
    }

    .textcenter {
        width: fit-content;
    }

    @keyframes zoomintitle {
        0% {
            transform: scale(0);
        }

        100% {
            transform: scale(1);
        }
    }

    @keyframes zoomintop {
        0% {
            transform: translateY(-600%);
        }

        100% {
            transform: translateY(0);
        }
    }

    * {
        scroll-behavior: smooth;
    }

    .view-container {
        justify-content: center;
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;
    }

    .view {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        border-width: 3px;
        border-radius: 20px;
        border-style: solid;
        width: 250px;
        height: 300px;
        margin: 20px;
        animation: fadein 1s;
    }

    .view-desc {
        font-size: 16px;
    }

    .view-content h1 {
        font-size: 24px;
    }

    .view-button {
        background-color: #4f46e5;
        color: white;
        border: none;
        font-weight: 600;
        font-size: 16px;
        font-family: Arial, sans-serif;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.5s ease;
        position: absolute;
        bottom: 0;
        right: 0;
        margin-bottom: 10px;
        margin-right: 15px;
    }

    .view-button:hover {
        background-color: #8046e5;
    }

    @keyframes fadein {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }

        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    body {
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
    }

    .bg-white {
        background-color: white;
    }

    .text-center {
        margin-top: 25vh;
    }

    .button-purple-color {
        background: #4f46e5;
        color: white;
        border: none;
        font-weight: 600;
        font-size: 39;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .button-texture {
        padding: 10px 14px;
        border-radius: .375rem;
    }

    .buttonpurple-hover-effect {
        background-color: #4f46e5;
        transition: background-color 0.5s ease;
        color: white;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
    }

    .buttonpurple-hover-effect:hover {
        background-color: #8046e5;
    }

    .nav-top-white li {
        list-style: none;
        display: inline-block;
        padding: 5px 14px;
        border-radius: .375rem;
        margin-top: 15px;
        font-weight: 600;
        font-size: .875rem;
        line-height: 1.5rem;
        cursor: pointer;
    }

    #navlogotext {
        color: black;
        opacity: 1;
        text-align: left;
        cursor: text;
    }

    .nav-text-color-gray {
        color: grey;
    }

    .nav-top-white {
        text-align: center;
        padding: 0;
        margin: 0;
    }

    @media (max-width: 767px) {
        nav {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .nav-top-white {
            margin-top: 0;
        }

        .nav-top-white li {
            display: block;
            margin: 10px 0;
        }
    }

    @media (max-width: 767px) {
        .featcontainer {
            flex-direction: column;
            align-items: center;
        }

    }

    @media (max-width: 767px) {
        .text-center {
            margin-top: 10vh;
            /* Adjust the margin-top value as needed */
        }

        .title {
            font-size: 31px
        }
    }
</style>`

    
}


module.exports = {
    sendCss
}