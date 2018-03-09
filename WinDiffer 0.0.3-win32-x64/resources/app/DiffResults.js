module.exports = {

    added : function(newObj){
        return {
            diffType : "Added",
            oldItem : null,
            newItem : newObj
        }        
    },

    modified : function(oldObj, newObj){
        return {
            diffType : "Modified",
            oldItem : oldObj,
            newItem : newObj
        }
    },

    deleted : function(oldObj){
        return {
            diffType : "Deleted",
            oldItem : oldObj,
            newItem : null
        }
    }
}
