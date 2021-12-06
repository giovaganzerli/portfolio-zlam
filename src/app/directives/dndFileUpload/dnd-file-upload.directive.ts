import {
    Directive,
    Output,
    Input,
    EventEmitter,
    ElementRef,
    HostBinding,
    HostListener
} from '@angular/core';

@Directive({
    selector: '[appDndFileUpload]'
})
export class DndFileUploadDirective {

    constructor(
        private el: ElementRef
    ) { }

    @Input() accept: string;

    @HostBinding('class.fileover') fileOver: boolean;
    @Output() fileDropped = new EventEmitter<any>();

    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = true;
    }

    // Dragleave listener
    @HostListener('dragleave', ['$event'])
    public onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = false;
    }

    // Drop listener
    @HostListener('drop', ['$event'])
    public ondrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = false;
        const accept = this.el.nativeElement.children[0].accept.replace(' ', '').split(',');
        const files = [];
        for (const file of evt.dataTransfer.files) {
            if (accept.indexOf(file.type) !== -1 ) {
                files.push(file);
            }
        }
        if (files.length > 0) {
            this.fileDropped.emit(files);
        }
    }
}
