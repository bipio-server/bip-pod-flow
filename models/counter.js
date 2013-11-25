Counter = {
    entityName : 'counter',
    entitySchema : {
        id: {
            type: String,
            renderable: false,
            writable: false
        },

        owner_id : {
            type: String,
            renderable: false,
            writable: false
        },

        channel_id : {
            type : String,
            renderable : true,
            writable : false
        },

        created : {
            type: Number,
            renderable: true,
            writable: false
        },

        // last append time
        last_update : {
            type : Number,
            renderable : true,
            writable : false
        },
        /*
        group : {
          type : String,
          renderable : true,
          writable : false
        },
*/
        // last build time
        count : {
            type : Number,
            renderable : true,
            writable : false,
            'default' : 0
        }
    },
    compoundKeyContraints : {
        channel_id : 1,
        owner_id :1 
    }
};


module.exports = Counter;