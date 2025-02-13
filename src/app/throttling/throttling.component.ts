import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndpointService } from '../services/endpoint.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { CustomValidators } from '../shared/validators/custom-validators';

interface Alert {
	type: string;
	message: string;
}

@Component({
  selector: 'app-throttling',
  templateUrl: './throttling.component.html',
  styleUrl: './throttling.component.css'
})
export class ThrottlingComponent implements OnInit {
  formGroupThrottling: FormGroup;

  ipFilterTooltip = 'The IP filtering plugin allows you to restrict the traffic to your API gateway based on the IP address. It works in two different modes (allow or deny) where you define the list of IPs (CIDR blocks) that are authorized to use the API, or that are denied from using the API.'
  timeoutTooltip = "Maximum time you'll wait for the slowest response"
  cacheTootip = "For how long a proxy can cache a request to this endpoint"
  cidrTooltip = "  The CIDR blocks (list of IPs) you want to allow or deny. Examples: 192.168.0.0/24, 172.17.2.56/32, 127.0.0.1"
  trustedProxTooltip = "A custom list of all the recognized machines/balancers that proxy the client to your application. This list is used to avoid spoofing when trying to get the real IP of the client."
  clientIPAddTooltip = "A custom ordered list of all headers that might contain the real IP of the client. The first matching IP in the list will be used"
  allowTooltip = "Check to only allow connections in the CIDR list. Uncheck to deny all IPs from the list."
  rateLimitTooltip = "Maximum requests you want to let this endpoint handle in the specified time (every). Leave 0 for no default limit."
  everyTooltip = "Time window where this rate limit applies."
  capacityTooltip = "Number of tokens you can store in the Token Bucket. Traduces into maximum concurrent requests this endpoint will accept for all users."
  userQuotaTooltip = "Maximum requests per second you want to allow to each different API user. This value will be used as default for all the endpoints unless overridden in each of them. Use 0 for no limitation."
  clientCapacityTooltip = "Number of tokens you can store in the Token Bucket for each individual user. Traduces into maximum concurrent requests this endpoint will accept for the connected user."
  endpointRateTooltip = "Limits the number of requests this endpoint can receive"
  tokenizerFieldTooltip = "A custom field that contains the tokenizer (e.g., extracting the token from a custom header other than Authorization or using a claim from a JWT other than jti)"
  tokenizerTooltip = "The strategy to define users. How do you identify a user?"
  burstTooltip = "How many requests a client can make above the rate specified during a peak"
  periodTooltip = "Time window on which the counters take effect."
  rateTooltip = "Number of allowed requests during the observed period."
  addressTooltip = "The host and port where your redis is using the format host:port, e.g.: redis:6379"
  redisTooltip = "The global rate limit functionality enables a Redis database store to centralize all KrakenD node counters. Instead of having each KrakenD node count its hits, the counters are global and stored in the database."


  cidrArray: any[] = [];
  trustedProxiesArray: any[] = [];
  clientIPHeadersArray: any[] = [];
  endpointId: any;
  endPointData:any;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private endpointService: EndpointService, private route: ActivatedRoute, private toastService: ToastService) {

    this.formGroupThrottling = this.formBuilder.group({
      timeout: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      cacheTtl: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      cidr: [''],
      cidrArrayValue: [[[]]],
      trustedProxies: [''],
      trustedProxiesArrayValue: [[[]]],
      clientIpHeaders: [''],
      clientIPHeadersArrayValue: [[[]]],
      allowModeActive: [false],
      rateLimit: [''],
      every: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      capacity: [''],
      defaultUserQuota: [''],
      clientCapacity: [''],
      address: [''],
      rate: [''],
      periods: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      burst: [''],
      tokenizer: [''],
      tokenizerField: [''],
      isIpFilterActive: [false],
      isEndPointRateLimitEnabledActive: [false],
      isRedisRateLimitEnabledActive: [false]
    })
  }

  showSuccess(message:string) {
    this.toastService.show(message, { type: 'success' });
  }


  showError(message:string){
    this.toastService.show(message , {type:"error"})
  }



  closeAlert(type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = '';
    } else {
      this.errorMessage = '';
    }
  }

  showSuccessAlert(message: string) {
    this.successMessage = message;
    this.errorMessage = ''; // Clear any previous error message
    setTimeout(() => {
      this.successMessage = ''; // Clear success message after 5 seconds
    }, 5000);
  }

  showErrorAlert(message: string) {
    this.errorMessage = message;
    this.successMessage = ''; // Clear any previous success message
    setTimeout(() => {
      this.errorMessage = ''; // Clear error message after 5 seconds
    }, 5000);
  }

  getEndpoint(){
    this.endpointService.getEndpointById(this.endpointId).subscribe({
      next: (res) => {
        console.log(res)
        this.endPointData=res;

        if(this.endPointData){
          this.cidrArray=this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["ip-filter"]?.CIDR ?? [];
          this.trustedProxiesArray=this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["ip-filter"]?.trusted_proxies ?? [];
          this.clientIPHeadersArray=this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["ip-filter"]?.client_ip_headers ?? [];
        }

        this.formGroupThrottling.patchValue({
          rateLimit: this.endPointData?.extra_config?.["qos/ratelimit/router"]?.max_rate,
          tokenizer: this.endPointData?.extra_config?.["plugin/http-server"]?.["redis-ratelimit"]?.tokenizer,
          burst: this.endPointData?.extra_config?.["plugin/http-server"]?.["redis-ratelimit"]?.burst,
          timeout: this.endPointData?.timeout,
          cacheTtl: this.endPointData?.cache_ttl,
          // cidr: [''],
          cidrArrayValue: this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["ip-filter"]?.CIDR ?? [],
          // trustedProxies: [''],
          trustedProxiesArrayValue:  this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["ip-filter"]?.trusted_proxies ?? [],
          // clientIpHeaders: [''],
          clientIPHeadersArrayValue: this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["ip-filter"]?.client_ip_headers ?? [],
          allowModeActive: this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["ip-filter"]?.allow,
          every:this.endPointData?.extra_config?.["qos/ratelimit/router"]?.every,
          capacity: this.endPointData?.extra_config?.["qos/ratelimit/router"]?.capacity,
          defaultUserQuota: this.endPointData?.extra_config?.["qos/ratelimit/router"]?.client_max_rate,
          clientCapacity:this.endPointData?.extra_config?.["qos/ratelimit/router"]?.client_capacity,
          address: this.endPointData?.extra_config?.["plugin/http-server"]?.["redis-ratelimit"]?.host,
          rate:  this.endPointData?.extra_config?.["plugin/http-server"]?.["redis-ratelimit"]?.rate,
          periods:  this.endPointData?.extra_config?.["plugin/http-server"]?.["redis-ratelimit"]?.period,
          tokenizerField:  this.endPointData?.extra_config?.["plugin/http-server"]?.["redis-ratelimit"]?.tokenizer_field,
          isIpFilterActive: !!this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.name.includes("ip-filter"),
          isEndPointRateLimitEnabledActive: !!this.endPointData?.extra_config?.["qos/ratelimit/router"],
          isRedisRateLimitEnabledActive: !!this.endPointData?.extra_config?.["plugin/http-server"]?.name.includes("redis-ratelimit")
        })

        console.log(this.endPointData);
      },
      error:(err)=>{
        console.log(err);
        this.showError(err?.message)
      }
    })
  }


  ngOnInit(): void {

    this.route.parent?.paramMap.subscribe(params => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);
    });

    this.getEndpoint()

    this.formGroupThrottling.get('isIpFilterActive')?.valueChanges.subscribe(value => {
      console.log(value);
      const cidrControl = this.formGroupThrottling.get('cidrArrayValue');
      if (value) {
        cidrControl?.setValidators([Validators.required]);
      } else {
        cidrControl?.clearValidators();// Clear validators if needed
      }
      cidrControl?.updateValueAndValidity(); // Re-evaluate the validation state
    });  

    // this.formGroupThrottling.get('isRedisRateLimitEnabledActive')?.valueChanges.subscribe((value) => {
    //   const controls = ['address', 'tokenizer', 'burst', 'rate', 'periods'].map(field =>
    //     this.formGroupThrottling.get(field)
    //   );
    
    //   if (value) {
    //     controls.forEach(control => control?.setValidators([Validators.required]));
    //   } else {
    //     controls.forEach(control => control?.clearValidators());
    //   }
    
    //   controls.forEach(control => control?.updateValueAndValidity());
    // });
    
    this.formGroupThrottling.get('isRedisRateLimitEnabledActive')?.valueChanges.subscribe((value) => {
      const addressControl = this.formGroupThrottling.get('address');
      const tokenizerControl = this.formGroupThrottling.get('tokenizer');
      const burstControl = this.formGroupThrottling.get('burst');
      const rateControl = this.formGroupThrottling.get('rate');
      const periodsControl = this.formGroupThrottling.get('periods');
    
      if (value) {
        addressControl?.setValidators([Validators.required]);
        tokenizerControl?.setValidators([Validators.required]);
        burstControl?.setValidators([Validators.required]);
        rateControl?.setValidators([Validators.required]);
        periodsControl?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]+(ns|ms|us|µs|s|m|h)$'),
        ]);
      } else {
        addressControl?.clearValidators();
        tokenizerControl?.clearValidators();
        burstControl?.clearValidators();
        rateControl?.clearValidators();
        periodsControl?.clearValidators();
      }
    
      // Update the validity of all controls
      [addressControl, tokenizerControl, burstControl, rateControl, periodsControl].forEach((control) => {
        control?.updateValueAndValidity();
      });
    });
    

    this.formGroupThrottling.get('isEndPointRateLimitEnabledActive')?.valueChanges.subscribe((value) => {
      if (value) {
        // Add the custom validator
        const existingValidators = this.formGroupThrottling.validator
          ? [this.formGroupThrottling.validator]
          : [];
        this.formGroupThrottling.setValidators([
          ...existingValidators,
          CustomValidators.anyOfValidator(['rateLimit', 'defaultUserQuota']),
        ]);
      } else {
        // Remove the custom validator
        const existingValidators = this.formGroupThrottling.validator
          ? [this.formGroupThrottling.validator]
          : [];
        this.formGroupThrottling.setValidators(
          existingValidators.filter(
            (v) => v !== CustomValidators.anyOfValidator(['rateLimit', 'defaultUserQuota'])
          )
        );
      }
      this.formGroupThrottling.updateValueAndValidity();
    });

  }

  addParameter(fieldName: 'cidr' | 'trustedProxies' | 'clientIpHeaders') {
    const fieldValue = this.formGroupThrottling.get(fieldName)?.value;

    if (fieldName) {
      if (fieldName === 'cidr') {
        this.cidrArray.push(fieldValue);
        this.formGroupThrottling.get('cidrArrayValue')?.setValue([...this.cidrArray])

      } else if (fieldName === 'trustedProxies') {
        this.trustedProxiesArray.push(fieldValue);
        this.formGroupThrottling.get('trustedProxiesArrayValue')?.setValue([...this.trustedProxiesArray])


      } else if (fieldName === 'clientIpHeaders') {
        this.clientIPHeadersArray.push(fieldValue);
        this.formGroupThrottling.get('clientIPHeadersArrayValue')?.setValue([...this.clientIPHeadersArray])

      }
    }
  }

  removeParameter(index: any, fieldName: 'cidr' | 'trustedProxies' | 'clientIpHeaders') {
    if (fieldName === 'cidr') {
      this.cidrArray.splice(index, 1);
      this.formGroupThrottling.get('cidrArrayValue')?.setValue([...this.cidrArray]);
    } else if (fieldName === 'trustedProxies') {
      this.trustedProxiesArray.splice(index, 1);
      this.formGroupThrottling.get('trustedProxiesArrayValue')?.setValue([...this.trustedProxiesArray]);

    } else if (fieldName === 'clientIpHeaders') {
      this.clientIPHeadersArray.splice(index, 1);
      this.formGroupThrottling.get('clientIPHeadersArrayValue')?.setValue([...this.clientIPHeadersArray])
    }

  }


  submit() {
    console.log(this.formGroupThrottling.value);

    const body = {
      "throttling":{
      ...(this.formGroupThrottling.value?.isEndPointRateLimitEnabledActive && {
        "qos/ratelimit/router": {
          ...(!!this.endPointData?.extra_config?.["qos/ratelimit/router"] && {"id":this.endPointData?.extra_config?.["qos/ratelimit/router"]?.id}),
          ...(this.formGroupThrottling.value?.rateLimit && { "max_rate": this.formGroupThrottling.value?.rateLimit }),
          ...(this.formGroupThrottling.value?.defaultUserQuota && { "client_max_rate": this.formGroupThrottling.value?.defaultUserQuota }),
          "strategy": "ip",
          ...(this.formGroupThrottling.value?.capacity && { "capacity": this.formGroupThrottling.value?.capacity }),
          ...(this.formGroupThrottling.value?.every && { "every": this.formGroupThrottling.value?.every }),
          ...(this.formGroupThrottling.value?.clientCapacity && { "client_capacity": this.formGroupThrottling.value?.clientCapacity })
        }
      }),
      ...(this.formGroupThrottling.value?.isRedisRateLimitEnabledActive && {
        "plugin/http-server": {
          ...(!!this.endPointData?.extra_config?.["plugin/http-server"] && {"id":this.endPointData?.extra_config?.["plugin/http-server"]?.id}),
          "name": [
            this.formGroupThrottling.value?.isRedisRateLimitEnabledActive && "redis-ratelimit"
          ].filter(Boolean),
          ...(this.formGroupThrottling.value?.isRedisRateLimitEnabledActive && {
            "redis-ratelimit": {
              ...(!!this.endPointData?.extra_config?.["plugin/http-server"]?.["redis-ratelimit"] && {"id":this.endPointData?.extra_config?.["plugin/http-server"]?.["redis-ratelimit"]?.id}),
              ...(this.formGroupThrottling.value?.address && { "host": this.formGroupThrottling.value?.address }),
              ...(this.formGroupThrottling.value?.tokenizer && { "tokenizer": this.formGroupThrottling.value?.tokenizer }),
              ...(this.formGroupThrottling.value?.burst && { "burst": this.formGroupThrottling.value?.burst }),
              ...(this.formGroupThrottling.value?.rate && { "rate": this.formGroupThrottling.value?.rate }),
              ...(this.formGroupThrottling.value?.periods && { "period": this.formGroupThrottling.value?.periods }),
              ...(this.formGroupThrottling.value?.tokenizerField && { "tokenizer_field": this.formGroupThrottling.value?.tokenizerField })
            }
          })
        }
      }),
      ...(this.formGroupThrottling.value?.isIpFilterActive && {
        ...(!!this.endPointData?.extra_config?.["plugin/req-resp-modifier"] && {"id":this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.id}),
        "plugin/req-resp-modifier": {
          "name": [
            this.formGroupThrottling.value?.isIpFilterActive && "ip-filter"
          ].filter(Boolean),
          ...(this.formGroupThrottling.value?.isIpFilterActive && {
            "ip-filter": {
              ...(!!this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["ip-filter"] && {"id":this.endPointData?.extra_config?.["plugin/req-resp-modifier"]?.["ip-filter"].id}),
               "allow": this.formGroupThrottling.value?.allowModeActive,
              ...(this.formGroupThrottling.value?.clientIPHeadersArrayValue.length != 0 && { "client_ip_headers": this.formGroupThrottling.value?.clientIPHeadersArrayValue }),
               "CIDR": this.formGroupThrottling.value?.cidrArrayValue,
              ...(this.formGroupThrottling.value?.trustedProxiesArrayValue.length != 0 && { "trusted_proxies": this.formGroupThrottling.value?.trustedProxiesArrayValue })
            }
          })
        }
      }),
    },
      ...(this.formGroupThrottling.value?.timeout &&{"timeout":this.formGroupThrottling.value?.timeout}),
      ...(this.formGroupThrottling.value?.cacheTtl &&{"cache_ttl":this.formGroupThrottling.value?.cacheTtl})


    }

    console.log(body);

    if(this.formGroupThrottling.valid){
      this.endpointService.addUpdateThrottling(this.endpointId,body).subscribe({
        next:(res:any)=>{
          console.log("added", res);
          this.showSuccess(res?.message);
          setTimeout(()=>{ this.getEndpoint()},3000)
        },
        error:(err)=>{
          console.error(err);
          this.showError(err?.error?.message);
          setTimeout(()=>{ this.getEndpoint()},3000)
        }
      })
    }else{
      if( this.formGroupThrottling.value?.isIpFilterActive && this.formGroupThrottling.value?.cidrArrayValue?.length == 0 ){
        this.showErrorAlert("Atleast one value must be selected for CIDR Array")
      }else if(this.formGroupThrottling.errors?.['anyOfError']) {
        this.showErrorAlert('At least one of "Rate Limit" or "Default user quota" must be provided.')
      }

    }

  }


}
