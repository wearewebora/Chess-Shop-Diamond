import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Navigation, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';

const SF_COORDINATES = { lat: 37.774929, lng: -122.419416 }; // San Francisco, CA

export const InteractiveContactMap: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDbDO4fJx-mgxQYh_hsx6xjcRnh2BXZcHQ';
  const [infoOpen, setInfoOpen] = useState(true);

  if (!apiKey) {
    return (
      <div className="h-64 w-full rounded-2xl bg-[#1c1a17] border border-[#38332d] flex flex-col items-center justify-center p-4 text-center">
        <MapPin className="w-8 h-8 text-[#81b64c] mb-2" />
        <p className="text-xs text-stone-300 font-bold">San Francisco, California</p>
        <p className="text-[11px] text-stone-500">Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#3d3731] shadow-xl relative bg-[#1c1a17]">
      <div className="h-64 sm:h-72 w-full relative">
        <APIProvider apiKey={apiKey} libraries={['marker']}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={SF_COORDINATES}
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_git_agentskills_v1']}
            className="w-full h-full"
          >
            <AdvancedMarker
              position={SF_COORDINATES}
              onClick={() => setInfoOpen(true)}
              title="Chess Shop US Fulfillment Hub"
            >
              <Pin
                background="#81b64c"
                borderColor="#587738"
                glyphColor="#ffffff"
                scale={1.2}
              >
                <span className="text-xs font-black">♟</span>
              </Pin>
            </AdvancedMarker>

            {infoOpen && (
              <InfoWindow
                position={SF_COORDINATES}
                onCloseClick={() => setInfoOpen(false)}
                headerContent={
                  <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <span className="text-[#81b64c]">♟</span> Chess Shop Digital Hub
                  </div>
                }
              >
                <div className="p-1 text-[11px] text-stone-700 space-y-1 max-w-[200px]">
                  <p className="font-medium">San Francisco, California</p>
                  <p className="text-[10px] text-stone-500">
                    24/7 Digital Concierge & Voucher Dispatch Node (US Nationwide)
                  </p>
                  <a
                    href="https://maps.google.com/?q=San+Francisco,+CA"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-sky-600 hover:underline font-bold mt-1"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Map Sub-footer badge */}
      <div className="p-3 bg-[#181614] border-t border-[#2e2a25] flex items-center justify-between text-[11px]">
        <span className="text-stone-300 font-medium flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-[#81b64c]" />
          <span>San Francisco Operations Core</span>
        </span>
        <span className="text-[10px] font-mono text-[#81b64c] bg-[#81b64c]/15 px-2 py-0.5 rounded-full border border-[#81b64c]/30 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Real-time Node
        </span>
      </div>
    </div>
  );
};
