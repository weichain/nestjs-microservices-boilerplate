import { SwaggerConstants } from '@lib/common';
import { Config } from '@lib/config';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(SwaggerConstants.TITLE)
    .setDescription(SwaggerConstants.DESCRIPTION)
    .setVersion(SwaggerConstants.VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  updateYamlApi(document);

  SwaggerModule.setup(SwaggerConstants.PATH, app, document);
}

function updateYamlApi(document: OpenAPIObject) {
  if (Config.NODE_ENV === 'development') {
    import('fs').then((fs) => {
      import('yaml').then((yaml) => {
        fs.writeFile('./docs/alter_api.yaml', yaml.stringify(document, {}), () => {});
      });
    });
  }
}
