<template>
  <el-dialog 
      title="编辑事件"
      :visible.sync="show"
      width="80%"
      :before-close="handleClose"
      append-to-body="true">
      <div class="list-panel">
        <ListPanel  @row-click="handleRowClick"/>
      </div>
    
    <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
  </el-dialog>
</template>

<script lang="ts">
    import { Message } from 'element-ui'
    import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
    import ListPanel from "./ListPanel.vue"
    @Component({
        components: {
            ListPanel
        }
    })    
    export default class DialogOpenFile extends Vue {

        @Prop() private show:Boolean=false;
        data() {
            return {
                formLabelWidth:'80px',
                myFormData:{},
                rule:{
                    figure_id:[
                    { required: true,min: 10, max: 10, message: 'id,长度在 2 到 10 个字符', trigger: 'blur' }
                    ]
                },
                data:{}
            }
        }
        handleRowClick(data){
            this.data=data;            
        }
        handleClose() {
        //this.show = false;
            this.$emit('update:show', false); //触发 input 事件，并传入新值
        }

        handleSubmit(){
            this.$emit("handleRowClick",this.data)
            this.$emit('update:show', false);
        }
    }
</script>

<style scoped>

.list-panel{
    width:90%;
    height:60vh;
}
</style>
