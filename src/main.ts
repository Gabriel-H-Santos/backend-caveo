import 'reflect-metadata';
import { Container } from 'typedi'
import { app, env, PostgresConnection } from '@config/index';
import { infoLog, errorLog } from '@shared/utils/loggerFormat'

const connect = async () => {
  await Container.get(PostgresConnection).connectDatabase()
}

connect().then(() => {
  app.listen(env.api.port, () => {
    infoLog({ msg: `${env.api.name} running on port ${env.api.port}...` })
  })
}).catch((error) => {
  errorLog({ msg: 'Error starting server:', error });
});

