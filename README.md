# chrome-tyoaika_v2
Kevyt Chrome extension työajan seurantaan

Projektien vaihtaminen:
1. Vaihda popup.html:ään oikeat projektinimet
2. Tee env.js niminen tiedosto kansion juureen ja lisää siihen env objekti:

const env = {
    user: OMA_NIMI,
    url: API_URL,
    client1: PROJEKTI1_NIMI,
    client2: PROJEKTI1_NIMI,
    client3: PROJEKTI1_NIMI
};

Asennus:
https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/
