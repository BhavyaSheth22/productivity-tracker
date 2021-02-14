import geocoder
import sys
g = geocoder.ip('me')
print(g.latlng)

sys.stdout.flush()