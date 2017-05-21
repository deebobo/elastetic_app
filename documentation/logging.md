# logging

deebobo uses winston as it's logging package. To write to the log from your plugins, use the following method:

```
const winston = require('winston')

winston.log('info', 'Hello log files!', {  
  someKey: 'some-value'
})
```

You can use the following log levels:

- error
- warn
- info
- verbose
- debug
- silly