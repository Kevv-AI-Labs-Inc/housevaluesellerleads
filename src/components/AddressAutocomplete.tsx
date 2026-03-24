"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (place: { formatted: string; lat?: number; lng?: number }) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts: Record<string, unknown>
          ) => GoogleAutocomplete;
        };
      };
    };
    __svGoogleMapsLoaded?: boolean;
    __svGoogleMapsCallback?: () => void;
  }
}

interface GoogleAutocomplete {
  addListener: (event: string, cb: () => void) => void;
  getPlace: () => {
    formatted_address?: string;
    geometry?: {
      location?: { lat: () => number; lng: () => number };
    };
  };
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  onKeyDown,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleAutocomplete | null>(null);
  const [loaded, setLoaded] = useState(false);

  const initAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google?.maps?.places || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "us" },
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address);
        onSelect?.({
          formatted: place.formatted_address,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        });
      }
    });
  }, [onChange, onSelect]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setLoaded(true); // Fall back to plain input
      return;
    }

    if (window.__svGoogleMapsLoaded) {
      setLoaded(true);
      initAutocomplete();
      return;
    }

    // Load Google Maps script
    window.__svGoogleMapsCallback = () => {
      window.__svGoogleMapsLoaded = true;
      setLoaded(true);
      initAutocomplete();
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__svGoogleMapsCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      delete window.__svGoogleMapsCallback;
    };
  }, [initAutocomplete]);

  useEffect(() => {
    if (loaded) initAutocomplete();
  }, [loaded, initAutocomplete]);

  return (
    <div className="relative">
      <MapPin
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10 pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        className="input-field pl-11"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
    </div>
  );
}
