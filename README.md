# maml

`maml` is a static website generator taking markdown and yaml as input.

`maml` is short for "markdown yaml" and pronounced as `['mɑːmel]`.

Chinese name is `马猫儿`.


## Features

##### Inspired by Ruby on Rails

- The folder structure is very similar to Ruby on Rails: assets, controllers, models, views.
- Convention over configuration.


##### Simple and easy to use

- Every page is a folder on disk, and every folder contains two files: `index.md` and `index.yml`.
- Configurations files could inherit, thus you don't need to specify everything for each page.
- It works out of the box.


##### Flexible

- If you are a developer and you can change the things in controller and views, then you can gain infinite flexibility.
- It could be as flexible as Ruby on Rails(without those dynamic features since it is a static website generator).


## Installation

```shell
yarn global add maml
```

or

```shell
npm install -g maml
```


# Documentation

[mamljs.github.io/docs/](http://mamljs.github.io/docs/)


## Quick start

```shell
mkdir mysite
cd mysite
maml init
maml build
```

Commands above creates a website named `mysite`, and build output into `mysite/dist/`.


## Show help

```shell
maml help
maml help init
maml help build
```


## License

MIT


## Websites built with maml

- [Tylingsoft - apps to boost your productivity](https://tylingsoft.com)
- [maml's official website](http://mamljs.github.io/)


## Todo

- debounce watch mode
