import * as MicrosoftGraph from "@microsoft/microsoft-graph-client";
import * as msal from '@azure/msal-browser';
import {AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
// <msalConfigSnippet>
const msalConfig = {
    auth: {
      clientId: '3df6193f-7d30-41d1-a3e1-e35695a4115d',
      redirectUri: 'http://localhost:8080'
    }
  };
  
  const msalRequest = {
    scopes: [
      'user.read',
      'mailboxsettings.read',
      'files.read'
    ]
  }
  // </msalConfigSnippet>
export class MyGraph{
    msalClient: msal.PublicClientApplication;
    account: msal.AccountInfo | null;
    graphClient:any = undefined;
    constructor(){
        this.msalClient = new msal.PublicClientApplication(msalConfig);
        this.account = this.msalClient.getActiveAccount();
        if (this.account) {
            this.initializeGraphClient(this.msalClient, this.account, msalRequest.scopes);
        }
    }
    initializeGraphClient(msalClient, account, scopes)
    {
      // Create an authentication provider
      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider 
      (msalClient, {
        account: account,
        scopes: scopes,
        interactionType: msal.InteractionType.Popup
      });
    
      // Initialize the Graph client
      this.graphClient = MicrosoftGraph.Client.initWithMiddleware({authProvider});
    }
    async signIn(){
        // Login
        try {
            // Use MSAL to login
            const authResult = await this.msalClient.loginPopup(msalRequest);
            console.log('id_token acquired at: ' + new Date().toString());

            this.msalClient.setActiveAccount(authResult.account);

            // Initialize the Graph client
            this.initializeGraphClient(this.msalClient, authResult.account, msalRequest.scopes);

            // Get the user's profile from Graph
            const user = await this.getUser();
            // Save the profile in session
            sessionStorage.setItem('graphUser', JSON.stringify(user));
            
        } catch (error) {
            console.log(error,"err");

        }
    }
    signOut(){
        sessionStorage.removeItem('graphUser');
        this.msalClient.logoutPopup();
    }
    async getUser() {
        return this.graphClient
          .api('/me')
          // Only get the fields used by the app
          .select('id,displayName,mail,userPrincipalName,mailboxSettings')
          .get();
    }
    async getOnedriveItem() {
        const events = await this.graphClient
          .api('/me/drive/root/children')
          //.select('folder')
          .get();
        let folders:any=[];
        console.log('events',events);
          events.value.forEach(element => {
            //console.log('element',element);
            if(element.folder){
              folders.push(element)
            }
            
          });
        console.log('folders',folders);
        return folders;
      }
}
import { createElement,createTextNode } from "@textbus/browser";

export class GraphUI{
    elementRef: HTMLElement;
    graph: MyGraph;
    btnSignIn: HTMLElement;
    btnOndrive: HTMLElement;
    constructor(){
        this.graph=new MyGraph();
        this.btnSignIn=createElement('button',{
            attrs:{
                type:'button',
                title:'SignIn'
            },
            children:[createTextNode('SignIn')]
        })
        this.btnOndrive=createElement('button',{
            attrs:{
                type:'button',
                title:'Ondrive'
            },
            children:[createTextNode('Ondrive')]
        })
        this.elementRef=createElement('div',{
            attrs:{

            },
            children:[
                this.btnSignIn,
                this.btnOndrive
            ]
        }) 
        this.btnSignIn.addEventListener('click',()=>{
            this.graph.signIn();
        })
        this.btnOndrive.addEventListener('click',()=>{
            this.graph.getOnedriveItem();
        })
    }
}