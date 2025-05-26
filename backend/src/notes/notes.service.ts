import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.notesRepository.create(createNoteDto);
    return this.notesRepository.save(note);
  }

  findAll(): Promise<Note[]> {
    return this.notesRepository.find();
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    await this.notesRepository.update(id, updateNoteDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.notesRepository.delete(id);
  }
}
