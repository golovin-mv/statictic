# Statistic-service

Сервис для описания запуска задач и периодического их выполения.
## Задача(Job)
-------------------
Основная сущность. Именно в рамках хадачи происходит обработка данных, сохрание в хранилищах и вызов экшенов. Задача может включать в себя любое количество источников, хранилищь, обработчиков, и действий.

  ```js
  const getExpectedValueSourceByChannel = new jobs.Job({
    actions: [],
    name: 'Среднее значение ВСЕХ лидов по Каналам',
    tags: ['Каналы'],
    description: 'Подсчет и сохранение среднего значения всех лидов в разрезе каналов',
    storages: [expectedValueAllLeadsByChannelStore],
    sources: [allLeadsByPerionAndChannel],
    handlers: [turncateExpectedValueByChannel, expectedValueByChannel, saveExpectedValueByChannel],
  });
  ```
Задачи в которых запоснено поле schedule будут выполняться периодически

```js
  const job = new jobs.Job({
    name: 'Лиды в СИБЕЛЬ по каналам',
    actions: [],
    description: 'Сохранение текущего и ожидаемого значения в Grafana',
    tags: ['Каналы', 'Сибель'],
    schedule: '0 * * * *',
    sources: [currentCountInSiebelByChannel],
    storages: [expectedValueSiebelLeadsByChannelStore, influxParams],
    handlers: [getLastHourValues, groupWithExepted, updateExepter, saveToInflux],
  });
```

Пока не реализовано api для создания задач все задачи создаются в момент запуска приложения. Описывается каждая задача в отдельном файле в папке 
**bootstrap**. Каждый такой файл должен импортировать функцию в которой создается задача.
```js
// ./bootstrap/test.js

module.exports = async () => {
    const testHandler = new handlers.Handler({
      name: 'testHandler',
      func: 'return {currentCountInAllByChannel}',
    });

    const testEmailAction = new EmailAction({
      to: ['foo@bar.buzz'],
      subject: 'Tesr',
      template: 'JSON.stringify(data.currentCountInAllByChannel)',
    });

    const testActionWithCondition = new ActionWithCondition({
      condition: '() => true',
      action: testEmailAction,
    });

    const testEmailJob = new jobs.Job({
      name: 'testEmailJob',
      storages: [],
      sources: [currentCountInAllByChannel],
      actions: [testActionWithCondition],
      handlers: [testHandler],
    });

    const _ = await collection.withCollection(jobs.COLLECTION_NAME).save(testEmailJob);
  };
}
```
**Важно**: не забыть вызвать метод *save* через *await* или вернуть его как промис

## Источник(Source)
-------------------

Источник это то откуда беруться исходные данные. Это может быть база данных, файл, память. Источник должен предоставлять данные в виде json обьекта. Все источники предоставляют данные только для чтения. 

Реализовано 2 вида источников: 

### MySqlSource
Источник база данных MySql. Для создания источника необходимо указать параметры подключения, тело запроса и параметры.
```js
 const currentCountInAllByChannel = new mySqlSource.MySqlSource({
    description: 'Вообще все заявки.',
    name: 'currentCountInAllByChannel',
    host: 'host',
    user: 'user',
    password: 'password',
    database: 'db',
    queryString: `select * from $tableName$`,
    param: {
      tableName: 'floan'
    }
  });
```
Также параметры можно задавать как функцию:

```js
 const currentCountInAllByChannel = new mySqlSource.MySqlSource({
    description: 'Вообще все за последний день.',
    name: 'currentCountInAllByChannel',
    host: 'host',
    user: 'user',
    password: 'password',
    database: 'db',
    queryString: `
      select * from $tableName$
      where add_date between($start$ and $end$)
    `,
    param: `
      const start = new Date();
      start.setDate(start.getDate() - 1);

      return {
        tableName: 'floan',
        start,
        end: new Date(),
      }
    `
  });
```

### InMemorySource
Данные в памяти используется для передачи параметров в job через интерфейс

```js
  const allLeadsByPerionAndChannel = new InMemorySource({
    name: 'allLeadsByPeriodChannels',
    description: 'Все лиды разбитые по дням, часам и каналам'
  });
```
## Хранилище(Storage)
--------------------
Хранилища служат для долгосрочного хранения данных необходимые для процесса вычисления или вычесленные в ходе его. Это могут быть средние знкачения, списки, константные значения. Одно и тоже хранилище может быть доступно в нескольких задачах. Данные в хранилище доступны для чтения и для записи.

```js
  const expectedValueAllLeadsByChannelStore = new storage.Storage({
    collectionName: 'expectedStorage',
    description: 'Хранилище средних значений с разбивкой по часам, дням и каналам',
    name: 'expectedValueAllLeadsByChannelStore',
  });
```

### InfluxStorage
Хранилице - база данных InfluxDB. Служит для сохранения временных рядов для последующей визуализации в Grafana.

```js
  const influxParams = new influxStorage.InfluxParams({
    name: 'influxParams',
    host: 'localhost',
    database: 'statistic',
    schema: [
      {
        measurement: 'allLeadsByChannel',
        fields: {
          expected: 0,
          current: 1,
        },
        tags: ['channel'],
      },
    ],
  });

```

## Обработчик(Handler)
--------------------
Функции для обработки данных. В каждой задаче есть обин или более обработчиков. Данные обрабатываются каждым добавленным обработчиком по цепочке. В каждом обработчике, в контексте функции доступны источники, хранилища и данные от предыдущего обработчика.Каждый обработчик должен выполнять только одну задачу, фильтрация, вычисление, сохранение.

```js
  const getLastHourValues = new handlers.Handler({
    name: 'getLastHourValues',
    description: 'Фильтрация по текущему часу'
    func: `
    const date = new Date();
    date.setHours(date.getHours() - 8);
    return  currentCountInAllByChannel.filter(el => el.hour === date.getHours())
  `,
  });

```
Параметр *func* - это строка, тело функции обработчика. В контексте функции хранилища и источники доступны по значению поля *name* хранилища и источника соответственно, а данные из предыдущих обработчиков в свойстве *data*. Все функции обработчики это async функции, и в них доступен await для асинхронных вычислений.

```js
const groupWithExepted = new handlers.Handler({
    name: 'group',
    func: `
    const res = [];
    for(t of data) {
      const expected = await expectedValueAllLeadsByChannelStore.find({
        dayOfWeek: t.dayOfWeek,
        hour: t.hour,
        channel: t.Channel,
      });
    
      res.push({
        curr: t,
        expected
      });
    }
    
    return res;`,
  });
```
## Действия(Action)
-----------------
Условные события которые выполняются в конце задачи.

```js
  const testEmailAction = new EmailAction({
    to: ['foo@bar.buzz'],
    subject: 'test',
    template: 'JSON.stringify(data.currentCountInAllByChannel)',
  });

  const testActionWithCondition = new ActionWithCondition({
    condition: '() => true',
    action: testEmailAction,
  });
```

Условие *condition* - строка тело функции, в ней доступны данные из источников и **последнего** обработчика.
