#!/usr/bin/env python3
"""Save real portfolio website screenshots as local assets.

Run from the website root: python3 tools/save_project_screenshots.py
Requires an Internet connection and uses the public Thum.io screenshot endpoint.
Only overwrites image references after all three successful PNG downloads.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from tempfile import TemporaryDirectory
import shutil

ROOT=Path(__file__).resolve().parents[1]
PREVIEWS=ROOT/'assets'/'previews'
PROJECTS={
    'lumiere':'https://lumiere-skinstudio.vercel.app/',
    'nexhaul':'https://nexhaul-logistics.vercel.app/',
    'wedding':'https://angelo-alexandra-wedding-website.vercel.app/'
}


def capture(url):
    shot='https://image.thum.io/get/noanimate/width/1200/crop/850/maxAge/24/'+url
    req=Request(shot,headers={'User-Agent':'Mozilla/5.0 GoodgroveDigitalPortfolio/1.0'})
    with urlopen(req,timeout=120) as response:
        data=response.read()
    if not data.startswith(b'\x89PNG\r\n\x1a\n') or len(data)<10_000:
        raise RuntimeError('Screenshot provider returned an unexpected or incomplete image')
    return data


def main():
    with TemporaryDirectory() as tempdir:
        temp=Path(tempdir)
        for name,url in PROJECTS.items():
            print('Capturing:',url,flush=True)
            (temp/f'{name}.png').write_bytes(capture(url))
        PREVIEWS.mkdir(parents=True,exist_ok=True)
        for name in PROJECTS:
            shutil.copyfile(temp/f'{name}.png',PREVIEWS/f'{name}.png')
    page=ROOT/'index.html'
    text=page.read_text(encoding='utf-8')
    for name,url in PROJECTS.items():
        remote='https://image.thum.io/get/noanimate/width/1200/crop/850/maxAge/168/'+url
        local='assets/previews/'+name+'.png'
        text=text.replace('src="'+remote+'"','src="'+local+'"')
    page.write_text(text,encoding='utf-8')
    print('Done: static screenshots stored under assets/previews/ and index.html updated.')

if __name__=='__main__':
    main()
