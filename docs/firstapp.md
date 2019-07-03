## Micro-twitter app

In this section we'll develop a toy demo application to show off some of the Frontless features. 
The purpose is to get an overview of Frontless stack (and full-stack development in general).

The micro-twitter app will consist of users and their associated microposts, thus constituting a minimalist Twitter-style app.

----------------------------
## Bootstraping the app

In this section, we’ll outline our plans for the application.
We’ll start by generating the application skeleton using the `create-frontless` command:

#### Application Sceleton

Open terminal and type following command:

```bash
npx create-frontless toytwitter --clean
```

**Application structure:**
![app_layout.png](/docs/firstapp/app_layout.png)

----------------------------
#### Database
By default Frontless is configured to use MongoDB, however advanced users can use any database of choice.
In order to run default Frontless distribution you need a running MongoDB instance whether on localhost or remote.
For this tutorial I recomend to use free plan on [cloud.mongodb.com](https://cloud.mongodb.com).

#### DB Configuration
Open `config -> environ.env` and add `MONGO_DATABASE` and `MONGODB_URI` variables for accessing your mongo instance:
```bash
MONGO_DATABASE=microtw
MONGODB_URI=mongodb+srv://user:password@cluster0-fffff.mongodb.net/microtw?retryWrites=true
```
**Example:**
![conf_env.png](/docs/firstapp/conf_env.png)

#### Start dev. server
Open terminal in the application directory and type:
```bash
npm run start
```
**Console output:**
![conf_env.png](/docs/firstapp/start_app.png)


Now navigate to [http://localhost:6767](http://localhost:6767)

-----------------------------------------------------------------------------
## Database Model
Let's otline a data model for our future application and keep it in mind.
By default, Frontless supports user sessions and basic login. It comes with basic user model out of the box.

#### User model
Default user model consists of following fields: 
```bash
_id: ObjectID [primary key]
usename: varchar
password: Bcrypt
group: varchar
agreed: bool
```
User is a MongoDB document so you can extend this model at will.

#### Message model
In our application users will be able to create a text messages. So we need to associate a message with the user that created it:

```bash
_id: ObjectID [primary key]
user: ObjectID [ref -> User._id]
text: varchar
```
#### DB diagram
![user_model.png](/docs/firstapp/user_model.png)
Let's keep this model in mind, we'll need it soon.

-----------------------------------------------------------------------------
## Creating Pages
Pages in Frontless are _higher level components_. Every page is a Riot.JS component which is rendered on either side - server and browser.
Any Riot.JS component placed in the `pages` directory is accessible by its name in browser, much like a `.php` script or a static page.

#### Create first page
Create a file named `user.riot` in the `pages` directory with following content: 
```html
<user-page>
  <h2>Hello User</h2>
  <script>
    export default ()=> ({
      title: 'User Profile'
    })
  </script>
</user-page>
```
**Now open the page in the browser [http://localhost:6767/user](http://localhost:6767/user)**

Congrats! You have created a first page with frontless! Next we'll add a cutom page layout and styles.

#### Layouts
Page layouts in Frontless are outlets for Riot.JS components. A layout provides base html page markup and external UI dependecies. 
Frontless make use of [ejs](https://ejs.co/) templates to render layouts.  I recommend to use layouts only for loading styles and scripts, everything else can be done by the means of Riot.JS templates.

Let's create a custom page layout. First create a file named `microapp.ejs` in `pages/layout` directory and copy content from `base.ejs` in it.
Then add a test script in bottom of the `<body>` section:
```html
<script>
  console.log('Page is rendered')
</script>
```
The scripts in layouts are executed in default order, so the last script will be executed right after the page rendered. It is convenient when you need to add external plugins to your pages or apply jquery code.

Now open previously created `pages/user.riot` and specify layout:
```html
<user-page>
  <h2>Hello User</h2>
  <script>
    export default ()=> ({
      layout: 'microapp',
      title: 'User Profile'
    })
  </script>
</user-page>
```

Reload the page at [http://localhost:6767/user](http://localhost:6767/user) and open browser console. The result should be as follows:
![custom_layout.png](/docs/firstapp/custom_layout.png)

Now we can modify layouts as required by adding custom markup to the `<body>` and `<head>` sections.

#### Writing CSS
Frontless supports [SASS](https://sass-lang.com/) for global styles and [JSS](https://cssinjs.org/) for writing dynamic CSS. 
Entry point for SCSS files is `styles.scss`. Vast variety of CSS frameworks are written in SASS like [Bootstrap 4](https://getbootstrap.com) or [Spectre CSS](https://picturepan2.github.io/spectre/). Frontless isn't married to any specific CSS framemework, however on screenshots in this tutorial is Spectre CSS. But in the code examples there won't be any styles at all so that you can pick your favorite framework.

**Importing a CSS framework:**
```scss
//styles.scss
@import 'node_modules/spectre.css/src/spectre.scss';
@import 'node_modules/spectre.css/src/spectre-icons.scss';
@import 'node_modules/spectre.css/src/spectre-exp.scss';
```

Everything is set! Let's start building the application itself.

-----------------------------------------------
## Working with forms
In this section we'll start building the application itsetlf beginning with user interface and ending with backend services.
Let's start from the basics that are required for our application to function.

#### Sing up form
Registration will consist of two modules:  _a sign up form_  and _registration API service_.

##### Form markup
Open the `pages` directory and create a file named `sign-up.riot` with following content:
```html
<sing-up>
  <div>
    <form onsubmit={ submit }>
      <h2>Sign Up</h2>
      <div>
        <input onfocus={reset} name="full_name" type="text" placeholder="Full Name">
        <p each={error in state.errors.full_name}>{error}</p>
      </div>
      <div>
        <input onfocus={reset} name="login" type="text" placeholder="Login">
        <p each={error in state.errors.login}>{error}</p>
      </div>
      <div>
        <input name="password" type="password" placeholder="Password">
        <p each={error in state.errors.password}>{error}</p>
      </div>
      <div>
          <button type="submit" >
            Sign Up
          </button>
      </div>
    </form>
  </div>
  <script>
    export default () => ({
      
      layout: 'microapp',

      state: {
        errors:{},
      },

      submit(ev) {
        ev.preventDefault()
        // handle form submit
      },

      reset(){
        this.update({
          errors:{}
        })
      }
    })
  </script>
</sign-up>
``` 

This is the base markup for our sign up form. The `<form>` submit event is handled by the `submit(ev)` method where we are going to send request to the future API. 
Every `<input>` field is paired with `<p>` tag which iterates over user input errors if they happen.
The componet's `state` keeps an object with validation errors. 

**Output:**
![signup_form1.png](/docs/firstapp/signup_form1.png)

#### Serializing forms
Now when we have all form elements in place it's time to handle user input. 
The simlest way to get the values from a form is to use method `serializeForm()` which takes the form element and returns a name-value map.
Let's add this method to our `submit` handler and see the output:
```javascript
import {serializeForm} from '@frontless/core'

export default () => ({
      
  layout: 'microapp',

  state: {
    errors:{},
  },

  submit(ev) {
    ev.preventDefault()
    // handle form submit
    const data = serializeForm(ev.target)
    console.log(data)
  },

  reset(){
    this.update({
      errors:{}
    })
  }
})
```
The method `submit` is executed whenever the user tries to submit form. Serializer handles the `<form>` element from `ev.target` and then we log the result to the console.

**Output:**
![form_serialization.png](/docs/firstapp/form_serialization.png)

#### Validating forms
In context of Frontless stack I recommend to use [validate.js](https://validatejs.org/) since it works the same way in node.js and browser.
Let's create a universal validation function that we are going to use in our form component and API service.

Create a file named `signup.validator.js` in the `./components` directory with following content:
```javascript
import validate from 'validate.js'

const Model = {
  full_name: {
    presence: {
      message: '^Name is required',
    },
    length: {
      maximum: 24,
      minimum: 6,
      message: '^Name must be from 6 to 12 symbols',
    },
  },
  login: {
    presence: {
      message: '^Login is required',
    },
    length: {
      maximum: 12,
      minimum: 4,
      message: '^Login must be from 6 to 12 symbols',
    },
  },
  password: {
    presence: {
      message: '^Password is required',
    },
    length: {
      minimum: 6,
      message: '^Minimum 6 symbols',
    },
  },
}

export default ({data}) => validate(data, Model)
``` 

------------------------------------------------------------------------
##### Let's apply the validation method to our form and see how it works:

```javascript
import {serializeForm} from '@frontless/core'
import validator from 'signup.validator'

export default () => ({
  layout: 'microapp',

  state: {
    errors:{},
    success: false,
  },

  submit(ev) {
    ev.preventDefault()
    const data = serializeForm(ev.target)
    console.log(data)
    const errors = validator({data,})
    console.log(errors)
    if (errors)
      return this.update({errors,});
    
  },

  reset(){
    this.update({
      errors:{}
    })
  }
})
```

--------------------------------------------------------------------
Now let's try to send an empty form and see what would be the output.

**Output:**
![validation_1.png](/docs/firstapp/validation_1.png)

##### How does the validator work?
The [validate.js](https://validatejs.org/) takes a javascipt object and compares the values by constraints we provided in the `Model`, 
then if the validation fails it would return an object with arrays of messages for every wrong value. If the validation passes the function would return nothing (undefined).
In our case, if the form doesn't pass validation we update component's state with the `errors` object, then the template will generate errors for every failed field.

----------------------------------------------------------------------
## Creating services
For a fullstack developer, implementing API is one of the most time-consuming and responsible routines. 
In order to make this job easier, Frontless makes use of [Feathers.JS](https://feathersjs.com) which is 
one of the best technologies in the field. 

[Feathers.JS](https://feathersjs.com) is well documented and I highly recommend to get a closer look at it beyond the scope of this tutorial.
If you never used Feathers.JS before, fear not - soon you'll realize that it is very simple and easy to use.

#### Sign up API
Create a file named `signup.js` in the `services` directory with following content:
```javascript
export default (app, mongo) => {
  app.use('signup', {
    async get(login) {
      // handle a GET request
    },
    async create(ctx) {
      // handle a POST request
    }
  })
}
```

Then open `services/index.js` and import `signup.js`:
```javascript
import users from './users'
import signup from './signup'
export default function (app, mongo) {
  users(app, mongo)
  signup(app, mongo)
}
```
We've just created the first api service. It doesn't do anything yet, but let's have a look at what we have at the time.
We added a function that receives two arguments: First arg - `(app)` is an express.js application instance which we can use to register our services. The second one - `(mongo)` is the MongoDB connection which we'll later use to access the storage.
Inside the factory function we registered a Feather.JS service by specifying CRUD operations that we need for the signup form to function.
Finally, we implicitly called this function inside `index.js` in order to make the service accessible in application.

#### Accessing MongoDB
Let's create a simple MongoDB query to check out if a login already taken by another user: 
```javascript
const {MONGO_DATABASE} = process.env
export default (app, mongo) => {
  const Users = mongo.db(MONGO_DATABASE).collection('users')
  app.use('signup', {
    async get(username) {
      const user = await Users.findOne({username,})
      return {
        exists: !!user
      }
    },
    async create(ctx) {
      // handle a POST request
    }
  })
}
```
This code takes database name from `MONGO_DATABASE` variable, then we aquire access a collection named `users`. Finally, in the `get` method we request a user by username and return the value `exists` which converts to Boolean type.

##### Calling API methods
Now it's time to make use of the first API method. 
In order to access services Frontless provides an universal client in scope of every Riot.JS component (this.client). 
###### Let's add a new method named `checkUserName` into `sign-up.riot` as follows:
```javascript
export default () => ({
  ...

  checkUserName(ev){
    const {value} = ev.target
    const Users = this.client.service('signup')
    Users.get(value).then(({exists}) => {
      if (exists) {
        this.update({
          errors: {
            login: ["This login is already taken"]
          }
        })
      }
    })
  },

  ...
})
```
This method gets `value` from the login field and then makes a `get` call to the signup service.

###### Now let's bind this method to `onblur` event for the login field:
```html
<input onfocus={reset} onblur={checkUserName} name="login" type="text" placeholder="Login" />
```
`onblur` event will trigger when the user switches to another fields. Better user experience would be to bind a debounced method to `keyup` handler, but we wont do this in context of this tutorial.

**Sign up form so far:**
```html
<sing-up>
  <div>
    <form onsubmit={ submit }>
      <h2>Sign Up</h2>
      <div>
        <input onfocus={reset} name="full_name" type="text" placeholder="Full Name">
        <p each={error in state.errors.full_name}>{error}</p>
      </div>
      <div>
        <input onfocus={reset} onblur={checkUserName} name="login" type="text" placeholder="Login">
        <p each={error in state.errors.login}>{error}</p>
      </div>
      <div>
        <input name="password" type="password" placeholder="Password">
        <p each={error in state.errors.password}>{error}</p>
      </div>
      <div>
          <button type="submit" >
            Sign Up
          </button>
      </div>
    </form>
  </div>
  <script>
    export default () => ({
      
      layout: 'microapp',

      state: {
        errors:{},
      },

      checkUserName(ev){
        const {value} = ev.target
        const Users = this.client.service('signup')
        Users.get(value).then(({exists}) => {
          if (exists) {
            this.update({
              errors: {
                login: ["This login is already taken"]
              }
            })
          }
        })
      },
  
      submit(ev) {
        ev.preventDefault()
        // handle form submit
      },

      reset(){
        this.update({
          errors:{}
        })
      }
    })
  </script>
</sign-up>
```
----------------------------------------------------------------------
#### Create users
Let's get back to the sign up service and think on how to implement user registration itself. 
First thing to consider is _validation_ for the create method. This is actually first matter of hand you should think of when you working close to the database. 
In the field there are several kinds of request validations that a backend developer concerned with, but for the purpose of this tutorial we'll 
only validate correctness of user input with previously created function. 
Second thing to consider is _data integrity_ which in this tutorial is limited to uniqness of usernames (logins). 

##### Validate user requests
We'll use previously created validator:
```javascript
// `services/signup.js`
import validator from 'signup.validator'
const {MONGO_DATABASE} = process.env
export default (app, mongo) => {
  const Users = mongo.db(MONGO_DATABASE).collection('users')
  app.use('signup', {
    async get(username) {
      const user = await Users.findOne({username,})
      return {
        exists: !!user
      }
    },
    async create(ctx) {
      // handle a POST request
    }
  })
}

```
