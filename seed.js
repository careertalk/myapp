const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const prefectures = [
  {
    prefectureId: '01',
    name: '北海道'
  },
  {
    prefectureId: '02',
    name: '青森県'
  },
  // 省略
  {
    prefectureId: '47',
    name: '沖縄県'
  }
]


async function run () {
  const promises = prefectures.map(async prefecture => {
    try {
      await exec(`npx wrangler d1 execute myapp-db --command "INSERT INTO  \"Prefecture\" (\"prefectureId\", \"name\") VALUES  ('${prefecture.prefectureId}', '${prefecture.name}');" --local`);
    } catch (error) {
      console.error(error);
    }
  })
  await Promise.all(promises);
}

run();