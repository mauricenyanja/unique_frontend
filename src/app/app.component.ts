import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { getDatabase, ref, set } from 'firebase/database';
import { ButtonModule } from 'primeng/button';
import { ApiCallsService } from './api-calls.service';
import { onValue } from 'firebase/database';
import { HttpClient } from '@angular/common/http';
import * as mime from 'mime';
import { initializeApp } from 'firebase/app';
import { MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [MessageService]

})
export class AppComponent implements OnInit {
  displayDialog = false;
  displayDialogNew = false;
  displayDial = false;
  displayNFTDialog = false;
  phoneNumber = '';
  name = ''
  description = ''
  tokenPrefix = ''
  payloadToRead: any;
  selectedFile: any = null;
  imageURL: string = '';
  db: any = null;
  showQRCodeBoolean: boolean = false;
  mnemonic = ''
  collection_id = ''
  token_id = ''
  sender = ''
  qrCode = '';
  myAddressToShow = ''




  constructor(
    private apiCallsService: ApiCallsService,
    private http: HttpClient,
    private messageService: MessageService
  ) { }
  ngOnInit() {

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'NFT Succesfully Minted' });


    const app = initializeApp({
      apiKey: "AIzaSyANDdVExPf4niRnvwAu4hUPZeeYp-NRaBk",
      authDomain: "safariapp-20f68.firebaseapp.com",
      databaseURL: "https://safariapp-20f68-default-rtdb.firebaseio.com",
      projectId: "safariapp-20f68",
      storageBucket: "safariapp-20f68.appspot.com",
      messagingSenderId: "22007293677",
      appId: "1:22007293677:web:3f220fa15d069cc3198ee4"
    }
      , 'my-app-name');

    this.db = getDatabase(app);

  }

  showDialog(isNew: boolean) {
    this.displayDialog = true;
    this.displayDialogNew = isNew;


  }

  onShowQRCode() {
    console.log("ENDD")
    this.readAccountFromPhoneNumber("0809809809")
    this.showQRCodeBoolean = true




  }



  onConfirm() {
    // do something with the phone number
    console.log('Phone number selected:', this.phoneNumber);
    const output = this.phoneNumber.replace(/[\(\)\s\-]/g, '');
    console.log(output); // output: '1234567890'


    if (this.displayDialogNew == true) {
      this.createAccount(output);
    } else {
      this.readAccountFromPhoneNumber(output)
    }

    this.displayDialog = false;
  }

  onCancel() {
    this.displayDialog = false;
  }

  createAccount(phoneNumber: string) {
    this.apiCallsService.getData().subscribe((data) => {

      const payload = {
        mnemonic: data.mnemonic,
        seed: data.seed,
        publicKey: data.publicKey,
        keyfile: {
          encoded: data.keyfile.encoded,
          address: data.keyfile.address,
          meta: {
            name: data.keyfile.meta,
          },
        },
      };
      console.log(payload);



      // Create a reference to the location where you want to store the data
      const myRef = ref(this.db, phoneNumber);
      // Store a value in the Realtime Database
      set(myRef, payload)
        .then(() => {
          console.log('Data saved successfully!');
          this.onCancel();

          this.readAccountFromPhoneNumber(phoneNumber);

          //show the account details
        })
        .catch((error) => console.error('Error saving data:', error));
    });
  }

  readAccountFromPhoneNumber(phoneNumber: string) {
    // const db = getDatabase();
    const starCountRef = ref(this.db, phoneNumber);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();

      this.mnemonic = data.mnemonic
      this.collection_id = data.collection_id
      this.token_id = data.token_id
      this.sender = data.keyfile.address


      this.payloadToRead = {
        mnemonic: data.mnemonic,
        seed: data.seed,
        publicKey: data.publicKey,
        keyfile: {
          encoded: data.keyfile.encoded,
          address: data.keyfile.address,
          meta: {
            name: data.keyfile.meta,
          },
        },
      };
      this.qrCode = this.mnemonic + "-" + this.collection_id + "-" + this.sender + "-" + this.token_id

      console.log(' I have read the data  : ', this.payloadToRead.keyfile.address);
      this.myAddressToShow = this.payloadToRead.keyfile.address
    });
  }

  showDialogCreateCollection() {
    console.log("" + this.name + " " + this.description + " " + this.tokenPrefix)
    this.apiCallsService
    .createNFTCollection(this.name,this.tokenPrefix,this.description)
    .subscribe((data) => {
      //Show toast message
      this.showToast("success", "NFT Collection Created Succesfully", "Congratulations Your NFT Collection is Succesfully Created")
      this.displayNFTDialog = false
    });
  }

  showDialogToUploadNFTs() {
    this.displayNFTDialog = true;
  }

  uploadNFT(address: string, tokenId: string, ipfs: string) { }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.http
      .post('https://rest.unique.network/opal/v1/ipfs/upload-file', fd)
      .subscribe((res: any) => {
        this.imageURL = res.url;
        //put adress , tokenId and ipfs links

        const collectionId = '1080';
        const mnemonic = 'lobster copper ghost tube public follow symptom attitude figure sense dizzy miss';
        const ipfscid = res.cid;
        this.showToast("info", "Image Uploaded Succesfully", "Please wait")
        this.showToast("info", "Minting NFT now", "Please wait")

        this.apiCallsService
          .sendData(collectionId, ipfscid)
          .subscribe((data) => {
            //Show toast message
            this.showToast("success", "NFT Minted Succesfully", "Congratulations Your NFT is Succesfully Minted")
            this.displayNFTDialog = false
          });
      });
  }


  // form.append('file', createReadStream(filename), );

  // const result = fetch(URL, { method: 'POST', body: form });
  // result.then((res) => {
  //   if (res.ok) {
  //     res.json().then(console.log);
  //   }
  // });



  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail
    });
  }

}

// Get a reference to the Firebase Realtime Database
