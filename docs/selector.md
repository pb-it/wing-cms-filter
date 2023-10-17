# Selector

## Boolean

```
$.[?(!@.active)]
```

TODO:

```
$.[?(@.active==false)]
```

## Multiple values for simple data type => OR

```
$.[?(@.id==1,2,3)]
$.[?(@.id!=1,2,3)]

$.[?(@.text==blabla,"bla bla")]
```


## Array

### OR

```
$.[?(@.stars[*].id==(1||3||5||10))]
```


### AND

```
$.[?(@.stars[*].id==(1&&3))]
```

### Length

```
$.[?(@.tags[*].length()==0)]
```


## Regex

```
$.[?(@.file =~ ^(.*mp4)$)]
```