import xml.etree.ElementTree as ET
import json
import os
import sys

# Add parent directory to path to import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.nlp import strict_key

def process_directv_channels(input_file, output_file):
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} not found.")
        return

    tree = ET.parse(input_file)
    root = tree.getroot()

    channels = []
    stats = {
        "total_channels": 0,
        "with_xmltv_id": 0,
        "missing_xmltv_id": 0
    }

    for channel_elem in root.findall('channel'):
        stats["total_channels"] += 1
        
        site_id = channel_elem.get('site_id')
        xmltv_id = channel_elem.get('xmltv_id')
        name = channel_elem.text
        
        if xmltv_id:
            stats["with_xmltv_id"] += 1
        else:
            stats["missing_xmltv_id"] += 1

        channels.append({
            "name": name,
            "site_id": site_id,
            "xmltv_id": xmltv_id,
            "strict_key": strict_key(name)
        })

    output_data = {
        "stats": stats,
        "channels": channels
    }

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)

    print(f"Processed {stats['total_channels']} channels.")
    print(f"Channels with XMLTV ID: {stats['with_xmltv_id']}")
    print(f"Channels missing XMLTV ID: {stats['missing_xmltv_id']}")
    print(f"Output saved to {output_file}")

if __name__ == "__main__":
    input_path = r"c:\Users\casey\Desktop\Google Antigravity\IPTV\epg\sites\directv.com\directv.com.channels.xml"
    output_path = r"c:\Users\casey\Desktop\Google Antigravity\IPTV\epg\directv_channels.json"
    process_directv_channels(input_path, output_path)
