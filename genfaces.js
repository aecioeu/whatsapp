var got = require("got");
const config = require("./config.json");
const sharp = require("sharp");

const min_age = 30,
  max_age = 50,
  sex = "female";

var avatars = [];

for (const comment of config.comments) {
  console.log(comment);
  avatars.push(comment.name);
  for (const response of comment.responses) {
    avatars.push(response.name);
  }
}

newFace(min_age, max_age, sex);
console.log(avatars);
async function newFace(min_age, max_age, sex) {
  var counter = 0;
  for (const avatar of avatars) {
    var name = `${avatar
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s/g, "")
      .toLowerCase()}`;

    const body = await got(
      `https://fakeface.rest/face/view?minimum_age=${min_age}&maximum_age=${max_age}&gender=${sex}`
    ).buffer();

    sharp(body)
      .webp()
      .toFormat("webp")
      .resize(128)
      .toFile(`./public/assets/images/faces/${name}.webp`);

    counter++;
  }
}
