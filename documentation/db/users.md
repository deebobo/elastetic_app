## Classes

<dl>
<dt><a href="#Users">Users</a></dt>
<dd><p>represents the users collection</p>
</dd>
<dt><a href="#*
* creates the collection that stores the user information.
	- fields_
		- name_ the name of the admin user.
		- email_ the email address of the admin user
		- hashedPassword_ a hash value of the password for the user.
		- salt_ encryption token
		- site_ the site to which the user has access
 	- createdOn_ date of record creation
		- group_ the group to which this user belongs
	- virtual fields_
		- password_ when set, calculate salt and hashedPassword
	- keys_
		- (unique) email - site
		- (unique) name - site">*
* creates the collection that stores the user information.
	- fields:
		- name: the name of the admin user.
		- email: the email address of the admin user
		- hashedPassword: a hash value of the password for the user.
		- salt: encryption token
		- site: the site to which the user has access
 	- createdOn: date of record creation
		- group: the group to which this user belongs
	- virtual fields:
		- password: when set, calculate salt and hashedPassword
	- keys:
		- (unique) email - site
		- (unique) name - site</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#.add_new">.add()</a> ⇒ <code>Promise</code></dt>
<dd><p>adds a user to the db</p>
</dd>
<dt><a href="#.update_new">.update()</a> ⇒ <code>Promise</code></dt>
<dd><p>updates a user</p>
</dd>
<dt><a href="#.update_new">.update()</a> ⇒ <code>Promise</code></dt>
<dd><p>updates the account state of a user</p>
</dd>
<dt><a href="#.find_new">.find()</a> ⇒ <code>Promise</code></dt>
<dd><p>finds a single record by id
populates the groups list, so it can easily be searched for (editor levels and such, for authorisation)</p>
</dd>
<dt><a href="#.find_new">.find()</a> ⇒ <code>Promise</code></dt>
<dd><p>finds a user by name or email for a specific site.
populates the groups list, so it can easily be searched for (editor levels and such, for authorisation)</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#mongoose">mongoose</a></dt>
<dd><p>Created by elastetic.dev on 25/05/2017.
copyright 2017 elastetic.dev
See the COPYRIGHT file at the top-level directory of this distribution</p>
</dd>
</dl>

<a name="Users"></a>

## Users
represents the users collection

**Kind**: global class  

* [Users](#Users)
    * [.list(&#x60;site&#x60;)](#Users+list) ⇒ <code>Promise</code>
    * [.addGroup(user, group)](#Users+addGroup)
    * [.removeGroup(user, group)](#Users+removeGroup)

<a name="Users+list"></a>

### users.list(&#x60;site&#x60;) ⇒ <code>Promise</code>
Returns all the users of a particular site.

**Kind**: instance method of [<code>Users</code>](#Users)  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the list of groups  

| Param | Type | Description |
| --- | --- | --- |
| `site` | <code>string</code> | The name of the site to list the groups for. |

<a name="Users+addGroup"></a>

### users.addGroup(user, group)
adds a user to the specified group

**Kind**: instance method of [<code>Users</code>](#Users)  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | id of the user. |
| group | <code>string</code> | id of the group. |

<a name="Users+removeGroup"></a>

### users.removeGroup(user, group)
removes the user from the specified group

**Kind**: instance method of [<code>Users</code>](#Users)  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | id of the user. |
| group | <code>string</code> | id of the group. |

<a name="*
* creates the collection that stores the user information.
	- fields_
		- name_ the name of the admin user.
		- email_ the email address of the admin user
		- hashedPassword_ a hash value of the password for the user.
		- salt_ encryption token
		- site_ the site to which the user has access
 	- createdOn_ date of record creation
		- group_ the group to which this user belongs
	- virtual fields_
		- password_ when set, calculate salt and hashedPassword
	- keys_
		- (unique) email - site
		- (unique) name - site"></a>

## *
* creates the collection that stores the user information.
	- fields:
		- name: the name of the admin user.
		- email: the email address of the admin user
		- hashedPassword: a hash value of the password for the user.
		- salt: encryption token
		- site: the site to which the user has access
 	- createdOn: date of record creation
		- group: the group to which this user belongs
	- virtual fields:
		- password: when set, calculate salt and hashedPassword
	- keys:
		- (unique) email - site
		- (unique) name - site
**Kind**: global class  
<a name=".add_new"></a>

## .add() ⇒ <code>Promise</code>
adds a user to the db

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `user` | <code>Object</code> | details about the user. The object should contain the following fields: 	- name: the name of the user.  	- email: the email address of the admin user 	- password: the password for the user. 	- site: the site to which the user has access 	- group: the group to which this user belongs |

<a name=".update_new"></a>

## .update() ⇒ <code>Promise</code>
updates a user

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `user` | <code>Object</code> | see add for more details |

<a name=".update_new"></a>

## .update() ⇒ <code>Promise</code>
updates the account state of a user

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `id` | <code>string</code> | the id of the user |
| `value` | <code>string</code> | the new value of the account state |

<a name=".find_new"></a>

## .find() ⇒ <code>Promise</code>
finds a single record by id
populates the groups list, so it can easily be searched for (editor levels and such, for authorisation)

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was found  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | id of the user record. |

<a name=".find_new"></a>

## .find() ⇒ <code>Promise</code>
finds a user by name or email for a specific site.
populates the groups list, so it can easily be searched for (editor levels and such, for authorisation)

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was found  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | name or email of the user. |
| site | <code>string</code> | name of the site. |

<a name="mongoose"></a>

## mongoose
Created by elastetic.dev on 25/05/2017.
copyright 2017 elastetic.dev
See the COPYRIGHT file at the top-level directory of this distribution

**Kind**: global constant  
