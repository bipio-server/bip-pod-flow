DeltaGate = {
  entityName : 'delta_gate',
  entitySchema : {
    id: {
      type: String,
      renderable: true,
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

    key : {
      type : String,
      renderable : true,
      writable : false
    },

    value : {
      type : String,
      renderable : true,
      writable : false
    }
  },
  compoundKeyContraints : {
    channel_id : 1,
    owner_id :1,
    key : 1
  }
};

module.exports = DeltaGate;