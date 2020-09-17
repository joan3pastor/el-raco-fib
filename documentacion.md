# Documentación
Documentación del proyecto orientada a la implementación de funcionalidades y testing.

## Índice
- [Rutas del directorio](#rutas-del-directorio)
- [Diagrama de flujo de componentes](#diagrama-de-flujo-de-componentes)
- [Capa de datos](#capa-de-datos)
- [Navegación](#navegación)
- [Token management](#token-management)
- [Actualizar versión de la aplicación](#actualizar-versión-de-la-aplicación)
- [Boilerplates](#boilerplates-1)
- [Scripts](#scripts)

## Rutas del directorio
Aquí están definidas las rutas principales del directorio.

#### App Components
- `src/components/navigation/`: Directorio contenedor de los componentes que forman las *vistas* de la aplicación.
- `src/components/Root.js`: Componente raiz encargado de cargar el paquete de idiomas y alternar entre las vistas de *Login* y *Home*.
- `src/components/Login.js`: Vista del inicio de sesión.
- `src/components/Home.js`: Componente intermedio donde se realiza el prefetch de los *REST requests* y configuración inicial.
- `src/components/Navigation.js`: En este fichero se gestiona la navegación entre vistas de la aplicación.

#### Redux
- `src/actions/index.js`: Documento JS contenedor de las acciones que son alimentadas a los *reducers*.
- `src/reducers/index.js`: La *Redux Store*. En este documento se define la interfaz a la capa de datos.
- `src/reducers/`: Los *reducers* espefifican como el estado de la *Redux Store* cambia en reacción a las acciones redux enviadas.

#### Recursos
- `src/languages/`: Directorio donde se encuentran definidos los paquetes de idiomas de la aplicación.
- `src/external_links.js`: Fichero JS conteniendo los enlaces externos utilizados por la aplicación.
- `static/`: Directorio conteniendo todo fichero binario cargado por la aplicación. Principalmente imagenes y GIFs.

#### Boilerplates
- `__boilerplates__/`: Plantillas para acelerar el proceso de implementación de funcionalidades y testing.

#### Tests
- `__tests__/`: Pruebas unitarias, de integración y *snapshots* a nivel vista.
- `__mocks__/`: Mocks de objetos de datos.
- `__stubs__/`: Stubs utilizados para testing.

#### Android settings
- `android/build.gradle`: Documento con la configuración del compilador de Android. 
- `android/app/build.gradle`: Documento para gestionar propiedades de la aplicación. Entre ellos, la *appId*, versión de la app, keystore...
- `android/app/src/main/AndroidManifest.xml`: Esquema del manifesto de la aplicación Android. 

## Diagrama de flujo de componentes
Diagrama de flujo simplificado de los componentes intermediarios de la aplicación: 

<img src="https://i.gyazo.com/49ab3f57be873420f9702547ff1d1f0b.png" alt="diagrama de flujo" width="545" height="431" />

## Capa de datos
Por tal de compartir datos entre componentes, esta aplicación utiliza Redux, un contenedor de estado predecible, junto a React Redux, una librería que ofrece enlaces entre React y Redux. Más información en la [documentación](https://redux.js.org/introduction/getting-started) de Redux.

Puedes enlazar nuevos componentes y crear nuevas entradas en la *Redux Store* utilizando los [*boilerplates*](#boilerplates-1) de Redux creados.

## Navegación
Esta aplicación utiliza React Navigation para gestionar la navegabilidad de la app. Puedes encontrar la estructura definida en `src/components/Navigation.js`. 

Consulta la [documentación](https://reactnavigation.org/docs/getting-started/) de React Navigation si deseas modificar la estructura. 

React navigation cede *handlers* de navegación a los componentes hijos. Se pueden destacar los siguientes métodos:
- `this.props.navigation.navigate('nombreVista');`: Para navegar a una determinada vista.
- `this.props.navigation.openDrawer()`: Abre el *drawer* de la aplicación.
- `this.props.navigation.push('nombreVista')`: Añade al *stack* de navegación una nueva vista y navega hasta ella.
- `this.props.navigation.goBack()`: Vuelve a la última vista visitada.

## Token management
Si vas a utilizar la API de la FIB y hay *requests* que no se realizan al instante de iniciarse la aplicación, cabe la posibilidad de que el token caduque, denegando el acceso al recurso. Por tal de solventar este posible problema de manera sencilla, hay una función importable para gestionar el token correctamente antes de acceder al recurso. Sigue los siguientes pasos para implementarlo:
- Importa la función updateToken en el componente en el que se va a realizar el *request*.
```
import updateToken from '../../actions/updateToken';
```
- Ya que *updateToken* tiene que consultar el token actual y actualizar el *Redux Store*, hará falta tener accesible la acción Redux *getToken* y el atributo *token* del *Redux Store* desde el componente para posteriormente ceder su contexto.

- Antes de realizar el *request*, ejecuta la función de la siguiente manera:
```
updateToken.call(this).then( (token) => {
  axios( url, { headers: {'Authorization': `Bearer ${token}`}
  }).then((resp) => {
    // ...
  });
});
```

## Actualizar versión de la aplicación
Una vez acumuladas suficientes mejoras en la aplicación, toca publicar una actualización. Por tal de mantener una consistencia en la metodología, sigue los siguientes pasos:
- En el fichero ubicado en `android/app/build.gradle`, incrementa en 1 el *versionCode* de la aplicación y el *versionName* a la versión adecuada según el peso de las mejoras que incorpora la actualización. 
  - v.1.X -> Incorpora una nueva funcionalidad.
  - v.1.X.X -> Soluciona errores de la versión previa.
- Actualiza la versión mostrada en la parte inferior derecha del *Drawer* de la aplicación. Puedes encontrar el fichero en `src/components/navigation/Drawer.js`.
- Genera un *commit* con el título "FIB Release - Version X.X.X"
```
> git commit -m "App Release - v.1.X"
```
- Fusiona la rama con la rama principal (*master*) del repositorio remoto y añade un tag de la versión actual:
```
> git pull master:master
> git checkout master
> git merge <rama_de_la_version_implementada>
- Si hay conflictos, resuelvelos y realiza un *commit*
> git tag -a <nombre_de_version>
> git push origin master:master --follow-tags
```
Alternativamente, con *pull requests*, [sigue esta guía](https://developers.sap.com/tutorials/webide-github-merge-pull-request.html).

Una vez seguidos estos pasos, la aplicación ya está lista para enpaquetarse y ser subida a la Google Play Store.

## Boilerplates
No empieces de cero. Utiliza un boilderplate para ganar tiempo durante el desarrollo.
- `nav_component.js`: Boilerplate de un componente tipo vista conectado a la *Redux Store*
- `component_test.js`: Boilerplate para escribir juegos de pruebas sobre un componente
- `redux_action.js`: Boilerplate con la estructura de una acción de Redux.
- `redux_reducer.js`: Boilerplate con la estructura de un *reducer* de Redux.

## Scripts
Este proyecto NodeJS incorpora un conjunto de scripts suficientes para gestionar la totalidad de la linea de comandos. Éstos son los siguientes:
- `npm run start`: Inicia una instancia del servidor Metro.
- `npm run android-clean`: Limpia la configuración de la aplicación Android y elimina los archivos compilados.
- `npm run android-run-debug`: Ejecuta la aplicación en modo *debug* en un dispositivo Android conectado.
- `npm run android-run-release`: Ejecuta la aplicación en modo *release* en un dispositivo Android conectado.
- `npm run generate-bundle`: Genera un fichero *.aab* (*Android App Bundle*).
- `npm run test`: Ejecuta los tests de pruebas.
- `npm run test-update-snapshots`: Ejecuta los tests y actualiza las snapshots si se encuentran modificaciones.
- `npm run test-coverage`: Analiza la cobertura de los tests implementados.
- `npm run nm-remove-git`: Elimina los directorios *.git* de *node_modules/* para evitar conflictos con Git y el gestor de dependencias.
