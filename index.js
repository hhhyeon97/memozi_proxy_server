const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // .env 파일에서 환경 변수 불러오기

const app = express();
// 서버가 배포되는 환경에서는 PORT 환경 변수를 통해 포트 값을 받아오고, 로컬에서는 5000번 포트를 사용
const PORT = process.env.PORT || 5000;

app.use(cors());

// 캐릭터 식별자 조회
app.get('/api/character/id/:name', async (req, res) => {
  try {
    const characterName = req.params.name;
    const response = await axios.get(
      `https://open.api.nexon.com/maplestory/v1/id?character_name=${characterName}`,
      {
        headers: {
          'x-nxopen-api-key': process.env.NEXON_API_KEY, // .env에서 API 키 불러오기
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching character ID');
  }
});

// 캐릭터 기본 정보 조회
app.get('/api/character/basic/:ocid', async (req, res) => {
  try {
    const ocid = req.params.ocid;
    const response = await axios.get(
      `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`,
      {
        headers: {
          'x-nxopen-api-key': process.env.NEXON_API_KEY,
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching character basic info');
  }
});

app.get('/api/character-image', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('이미지 가져오기 오류');
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
