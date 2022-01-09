import 'dotenv/config';
import * as express from 'express';
import * as morgan from 'morgan';
import {createStorage} from './storage';
import {ImageProvider} from './ImageProvider';
import {getRedirectPath} from './util';

(async () => {
  const storage = await createStorage();
  console.log(`Using ${storage.constructor.name} as storage backend`);

  const imageProvider = new ImageProvider(storage);

  const app = express();
  app.use(express.json());

  app.use(morgan(process.env.NODE_ENV == 'production' ? 'combined' : 'dev'));

  // redirect to direct
  app.get('/', (req, res) => res.redirect(301, '/direct'));

  // redirect to the new redirect endpoint
  app.get('/b/', (req, res) => res.redirect(301, '/redirect'));

  // random image without redirect
  app.get('/direct/:path(*)?', async (req, res, next) => {
    try {
      // get random image
      const imagePath = await imageProvider.getRandomImagePath(req.params.path);

      // get image data
      const data = await imageProvider.getImageData(imagePath);

      // set content type and and send buffer
      res.status(200).type(data.type).send(data.buffer);
    } catch (error) {
      next(error);
    }
  });

  app.get('/redirect/:path(*)?', async (req, res, next) => {
    try {
      // get random image
      const imagePath = await imageProvider.getRandomImagePath(req.params.path);

      // redirect to the final image path
      res.redirect(302, getRedirectPath(imagePath));
    } catch (error) {
      next(error);
    }
  });

  app.get('/img/:path(*)', async (req, res, next) => {
    try {
      // get image data
      const data = await imageProvider.getImageData(req.params.path);

      // set content type and and send buffer
      res.status(200).type(data.type).send(data.buffer);
    } catch (error) {
      next(error);
    }
  });

  // generic error handler
  app.use((error, req, res, next) => {
    console.error(error);
    return res.status(500).send(error.message ?? error.toString());
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
})().catch(error => {
  console.error(error);

  // force close if we get an exception while initialing
  process.exit(1);
});
