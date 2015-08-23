
module.exports = function(RED) {
    "use strict";

    function kisiUnlock(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var account = RED.nodes.getNode(config.account);
        var kisi = account.kisi;

        this.on('input', function (msg) {

           if(!account){
             console.log('no account');
             return;
           }

           if(msg.topic == 'unlock'){
              this.unlock();
           }
        });

        this.on("close", function() {

        });

        this.unlock = function(){
          account.authenticate().then(function(){
                //not really unlocking
                // kisi.get('keys', { limit: 10 }).then(function(response) {
                //   console.log('keys', response.body.items);
                // });
                //
                // kisi.get('locks').then(function(response) {
                //   console.log(response.body);
                //   node.send(response.body.items);
                // });

                kisi.post('locks/'+config.lockid+'/access', {}).then(function(response){
                  node.send(response.body);
                });

          });


        }


    }

    RED.nodes.registerType("kisi-unlock",kisiUnlock);

    RED.httpAdmin.post("/kisi-unlock/:id", RED.auth.needsPermission("kisi.unlock"), function(req,res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                var test = node.unlock();
                res.send("COOL!");
            } catch(err) {
                res.send(500);
                node.error(RED._("inject.failed",{error:err.toString()}));
            }
        } else {
            res.send(404);
        }
    });


}
