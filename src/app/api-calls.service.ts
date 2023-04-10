import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getDatabase, ref, set } from 'firebase/database';
import { from } from 'rxjs';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ApiCallsService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    const url = '/api/create-account';
    return this.http.get(url);
  }

  writeUserData(
    mnemonic: string,
    seed: any,
    publicKey: string
  ): Observable<any> {
    const db = getDatabase();
    const dbRef = ref(db, 'accounts/' + mnemonic);
    const data = { mnemonic, seed, publicKey };
    return from(set(dbRef, data));
  }

  createNFT(collection_id: string, mnemonic: string, ipfscid: number): Observable<any> {
    const body = { collection_id:collection_id, ipfscid:ipfscid };
    return this.http.post('/api/make-nft', body);
  }
  

  
  createNFTCollection(collection_name: string, token_prefix: string, description: string): Observable<any> {
    const body = { collection_name:collection_name, token_prefix:token_prefix,description: description };
    return this.http.post('/api/create-collection', body);
  }
  
  sendData(collectionId: string, ipfscid: string): Observable<any> {
    const requestBody = {
      collection_id: collectionId,
      ipfscid: ipfscid
    };

    return this.http.post('/api/make-nft', requestBody);
  }


 

}
 