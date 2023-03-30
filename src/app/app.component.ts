import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, set } from 'firebase/database';
import { ButtonModule } from 'primeng/button';
import { ApiCallsService } from './api-calls.service';
import { onValue } from 'firebase/database';
import { HttpClient } from '@angular/common/http';
import * as mime from 'mime';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayDialog = false;
  displayDial = false;
  phoneNumber = '';
  payloadToRead: any;
  selectedFile: any = null;
  imageURL: string = '';
  constructor(
    private apiCallsService: ApiCallsService,
    private http: HttpClient
  ) {}
  ngOnInit() {}

  showDialog() {
    this.displayDialog = true;
  }

  onConfirm() {
    // do something with the phone number
    console.log('Phone number selected:', this.phoneNumber);
    const output = this.phoneNumber.replace(/[\(\)\s\-]/g, '');
    console.log(output); // output: '1234567890'

    this.createAccount(output);

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

      const db = getDatabase();
      // Create a reference to the location where you want to store the data
      const myRef = ref(db, phoneNumber);
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
    const db = getDatabase();
    const starCountRef = ref(db, phoneNumber);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();

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
      console.log(' I have read the data  : ', this.payloadToRead);
    });
  }

  showDialogCreateCollection() {}

  showDialogToUploadNFTs() {}

  uploadNFT(address: string, tokenId: string, ipfs: string) {}

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.http
      .post('https://rest.unique.network/opal/v1/ipfs/upload-file', fd)
      .subscribe((res: any) => {
        this.imageURL = res.url;
        //put adress , tokenId and ipfs links
        const collectionId = '';
        const mnemonic = '';
        const ipfscid = res.cid;

        this.apiCallsService
          .createNFT(collectionId, mnemonic, ipfscid)
          .subscribe((data) => {
            //Show toast message
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
}

// Get a reference to the Firebase Realtime Database
