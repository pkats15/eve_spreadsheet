import requests
import simplejson
import datetime
def ratio_from_avg(low, high, avg):
    a = (high-avg)/(avg-low)
    return a

def to_time(time_str):
    year = int(time_str[:4])
    month = int(time_str[5:7])
    day = int(time_str[8:10])
    hour = int(time_str[11:13])
    minute = int(time_str[14:16])
    return datetime.datetime(year,month,day,hour,minute)
    
def less_than_1h(time):
    delta = datetime.datetime.utcnow() - time
    return delta.seconds<60*60

domain_region = 10000043
ifcm = 2621
endp = 'https://crest-tq.eveonline.com/market/'
inv_base = 'https://crest-tq.eveonline.com/inventory/types/'
param = {'type': inv_base + str(ifcm) + '/'}
print(param)
url = endp + str(domain_region) + '/orders/buy/'
# print(param)
print(url)
r = requests.get(url, params=param)
js = r.json()
items = js['items']
items = sorted(items, reverse=True, key=lambda k:k['price'])
for i in items:
    print(i['price'])
    t = i['issued']
    print(less_than_1h(to_time(t)))
