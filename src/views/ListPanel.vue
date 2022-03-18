<template>
    <div style="display:flex;height:100%;flex-wrap:wrap;">
      <div class="panel-header" style="width:100%;display:flex;">
        <select value="selectValue"><option value="cmd">cmd</option></select>
        <el-input style="width:25%;" v-model="input" size="medium  " placeholder="请输入命令"/>
        <el-button size="medium" @click="handleSubmit">确认</el-button>
        &nbsp;当前路径：{{current}}
      </div>
        <el-tree  :highlight-current="true"
                  :load="loadNode"
                  lazy
                  :props="props"
                  node-key="value"
                  :default-expanded-keys="expandedKeys"
                  :expand-on-click-node="false"
                  @node-click="handleNodeClick" />
        <el-table :data="listData" stripe height="calc(100vh - 42px)" 
                  @row-click="handleRowClick"
                  :highlight-current-row="true">
          <el-table-column prop="name" label="文件名" width="" align="center"></el-table-column>
        </el-table>
      </div>
</template>
<script lang="ts">
    import { api } from '../utils/axios/api';
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
      selectValue:string="cmd";
      input:string="";
      current:string="";
       data(){
         return {           
            props: {
              label: 'name',
              children: 'children',
              value:"value",
              isLeaf: 'leaf'
            },
            expandedKeys: ["upload/note"],           
         }
       }
       handleSubmit(){
         if(this.input==""){return}
         if(this.selectValue=="cmd"){
           this.$emit("handleCMD",this.input)
         }
         if(this.selectValue=="search"){
           this.handleSearch(this.input)
         }
         //this.current=+"："+this.input
       }
       handleSearch(keyword){
         console.log(keyword)
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
         //(this.$refs.tree as any).setCurrentNode(node);
         const form = new FormData();
          form.append('filePath',node.value)
          api.r.files(form).then(response=>{
            this.listData =response.data.data
          })                          
       }
       handleRowClick(data){
          this.current=data.value;
          this.$emit('row-click',data);
       }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main{
  display: flex;
}
.panel-header{
  color:#495060;
  background-color:#F8F8F9 ;
  border: 1px solid #dddee1;
  height:40px;
  line-height: 40px;
  padding-left: 20px;
}
.el-tree{
  width:30%;
  background-color: #F8F8F9;
}
.el-table{
  width:70%;
}

</style>
