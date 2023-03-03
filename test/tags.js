'use strict';


const async = require('async');
const assert = require('assert');
const nconf = require('nconf');
const request = require('request');

const topics = require('../src/topics');
const db = require('./mocks/databasemock');

describe('Tags', () => {
    let tagsObj;

    it('should add tag to url of all tag', (done) => {
        
    });

    it('should create a new tag', (done) => {
        topics.createEmptyTag();
    });

    it ('should check tag on certain post', (done) =>{
        topics.post({
            uid: voterUid,
            cid: cid,
            title: 'topic to edit',
            content: 'A post to edit',
            tags: ['nodebb'],
        });
    });



});