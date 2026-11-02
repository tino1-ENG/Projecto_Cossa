import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const frontendDir = path.join(rootDir, 'frontend', 'public', 'images', 'products');
const backendDir = path.join(rootDir, 'backend', 'uploads', 'products');

fs.mkdirSync(frontendDir, { recursive: true });
fs.mkdirSync(backendDir, { recursive: true });

const imagesList = [
  {
    name: 'porsche-911-gt3rs.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgTWUrHgkqC4fcafz0WSN3fkeynqRLiQgBcRH7pYg6zi4eEYQAY_AtfTrB5ad9v5LCiEFVQKX8L8mmjhSE478aowuWK3hRwPY9mqPnajU5FTmA-peTHZQjhurbJ347H7nFYCuL5d1UyW3S3xbjB1GWUW22FGn5fAOEu_Ppf2kNPb4VWbdpIvv_ohG4V31iIGpIlL5lwHAeccg0FITaunpPTaT_mk5l2xARFXe8IwIT'
  },
  {
    name: 'bmw-m4-competition.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAINv79aWFbj_cYQYWPnpH5xV54bUXGawdeSUvBHYiP-bIaInl2R5p_onLbSe-AdTlUc6ysHNnpX32pJVZHAI1-YbegfPOb_e11sPqRWkLmWx6mblxVNj1sEZWFF6QSsmMILwreVB-KbmXhuR8oxyJvSXBMixXjWmC3PzMSNAxUH5x3PLW5Lr8S3CRadu3lH60DRPSu0emVOF4fb8BTeG1PGftnAlgf7Ruc9iCb_YVl'
  },
  {
    name: 'rolex-submariner.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNLK0652-H0n3TitFzp_Md4HLi7bilqUT95xyKX86M1ZHhn_3Pj5hhBn8KwfqfuPai9Goioa2LgsxpBIgTlGNKdhHVAFbjgAIiwAkd5L6_0Aj4ooR9MG13rkxzHEVjyfPQS0oWGmN3DGx-CsZnrUmKKj3tOkAXW5x7zg9j-VFzNcIu9VlK6RHUJqOBVR6n78wxcJcEyLfPt3f1xsFhv2_UBkWTKsVxaaJfV8XLNogp'
  },
  {
    name: 'land-cruiser-300.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMKAN7LDZNQuAdc6lRAKzgZp3-JZCYqgTHX_6HeYKWpBqe6rSToQY4iH3fsO5QZDv9-rJhRKNSdUslv65o4SKs3tarn5stkIImV508jXfmGj0y4SVfFJZggkDXbrAHbCTLzssdGFXxkDi9QlKK-U0uARqTfvAsfZnc8bdlVIiFt5qaKk6-dbJVefYDcDRzPQHasJxZq8bRslbmRsp4rwq6vYxUbp2Uhw9-UnDhHXwf'
  },
  {
    name: 'cat-320-excavator.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuT4A05oa1zEWjxYWFRr5o1tbHDCRi3CZ69_1m2Is9c7vroNLuBUvdM23nXNcTLvflw_a0Rc0EcDx5J6PqxU3Z3O0-6spQRowVCwD9gtpfBkIZ-IBsqdjoicd3bmyZLtsc97ABtG37n96JIYHNrxKWXBp0wnSO7ScV6hCM1N0HlHee_dl6ULsyZJ5V7h7vf2auT9JvMkccV6s9GeZfwknLHsii2CdptxYG0fyNW53p'
  },
  {
    name: 'mercedes-amg-g63.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoX6IlrPuBTUYOnBbDqADkJxu1JiZ9hstWTAXXzKRv8P8G6IZD_9SBPG_Wr6MmvaraQ_I-1c45439bIDJVKEHXyr4Z9kRQgoESLPnakB7YDFdXNma-NC5hcigutE2xpVwP_z3fbG_9JCK7NJ4oNfi2pdVpkYgitEn05IY1nE8ywsyDnbeLjPcFinH-JbATLtliI7GSo1S-dJdeSSKp_ZhRYgQByK7oaa0yv_bEch9L'
  },
  {
    name: 'patek-philippe.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLm2jDZeNDIFhzNz-bGes-XxKMkJ2DWCOUr9Vc5R10M9czJgeZMTOAev1ljqdJYNRd8Jx6GvcbXAQddedPHUYjx7e7AjwlzfPgUMebSgh-kSK-0McDtTTdv1iSPIwye4ER7ei9QFJgaJdDg4U-U0YwpxSFKDY7GIcanurh-byYVq2jikvmRNd9Br4saA2q2fy3DcMNU3Fb-G5m3uV5ZdEHZmCpwNYFAEFmFD1grws-'
  },
  {
    name: 'komatsu-d65.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC4IKfHUhFYwpkhXvbOu-YsakuOK0O3mUC42J1aLQndfOBpSuexMkfMbYZmFuKj7ernE5mqcdSdojZm837iYjfvdM06N-fG4eJfU9WRZxJ-Stz3V3mM3QlpATjqB9i5t8YkyICmtMEZKjQoJTM5zdupOuLOc4PZ-vzosJcT0O8NkEZb4nq2qvWF5utVVVQXt3czkdcH2IBNZtJQ27mj3S-ghkWxv5Dr6Gh_-iAdxi_'
  },
  {
    name: 'studio-servers.jpg',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKGlDKijL1V0UhunjFMLdsWROH5b49V2ce2uz5SxRmB3wUwoNqYgw3lVIKcb8ti2Hae3-gJedLU1TZIDJcUy9bxtH_rlZn_hg5M5GJ3CXaV8GvghLgiGCIO7LcK4kLHfmGXRM0RLkZpWYjG7PA73399U_PLRMeXjoiYwNg4CWlZa9bTRxps0o-FCJiVyxsy_kvbgAr2XcolLg2WU_gJcTkMUG6AMKJz9JsF5BOCp_4'
  },
  {
    name: 'hilux-legend-rs.jpg',
    url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'macbook-pro-m3.jpg',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'cummins-generator.jpg',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'hp-elitebook-fleet.jpg',
    url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=85'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { rejectUnauthorized: false }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    });
    req.on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading product images into organized local folders...');
  for (const item of imagesList) {
    const fPath = path.join(frontendDir, item.name);
    const bPath = path.join(backendDir, item.name);
    try {
      console.log(`Downloading ${item.name}...`);
      await downloadFile(item.url, fPath);
      fs.copyFileSync(fPath, bPath);
      console.log(`  -> Saved ${item.name} (${fs.statSync(fPath).size} bytes)`);
    } catch (e) {
      console.warn(`  Warning downloading ${item.name}: ${e.message}`);
    }
  }
  console.log('Image setup complete!');
}

run();
