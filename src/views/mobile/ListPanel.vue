<template>
    <div style="display:flex;height:100%;flex-wrap:wrap;">
        <el-tree :load="loadNode"
                  lazy
                  :props="props"
                  node-key="value"
                  :default-expanded-keys="expandedKeys"
                  :highlight-current="true"
                  :expand-on-click-node="false"
                  @node-click="handleNodeClick" />
        <el-table :data="listData" stripe height="100%" 
                  @row-click="handleRowClick"
                  :highlight-current-row="true"
                  header-cell-class-name="cellclass">
          <el-table-column prop="name" label="文件名" width="" ></el-table-column>
        </el-table>
      </div>
</template>
<script lang="ts">
    import { api } from '../../utils/axios/api';
    import qs from 'qs';
    import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
    //import {createEditor} from "../../bundles/createEditor"
    //import { h } from 'vue';
    @Component({
        components: {
            
        }
    })
    
    export default class ListPanel extends Vue {
      //@Ref() readonly textbus!:;
      listData:any=[]
       data(){
         return {
           current:"",
            props: {
              label: 'name',
              children: 'children',
              value:"value",
              isLeaf: 'leaf'
            },
            expandedKeys: ["upload/note"],           
         }
       }
       loadNode(node, resolve){
          let filePath;
          if (node.level === 0) {
              return resolve([{name:"笔记",value:"upload/note"}])     
          }else if(node.level === 1){
            filePath="upload/note" 
          }
          else{
            filePath=node.data.value
          }

          const form = new FormData();
          form.append('filePath',filePath)
          api.r.folders(form).then(response=>{
            return resolve(response.data.data)
          })
          
       }
       handleNodeClick(node){

         const form = new FormData();
          form.append('filePath',node.value)
          api.r.files(form).then(response=>{
            this.listData =response.data.data
          })
                          
       }
       handleRowClick(data){
           this.$emit('row-click',data);
       }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

#main{
  display: flex;
}
.el-tree{
  width:30%;
  background-color: #F8F8F9;
}
.el-table{
  width:70%;
}
.cellclass{
  background-color: aquamarine !important;
  text-align: center !important;
}
</style>
