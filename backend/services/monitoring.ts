export function monitor(metric:string,value:any){
  console.log(JSON.stringify({metric,value,timestamp:new Date().toISOString()}));
}
